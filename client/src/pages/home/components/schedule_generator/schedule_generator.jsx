import React from "react";
import PropTypes from "prop-types";

/**
 * ScheduleGenerator
 * A minimal template component for schedule generation UI.
 *
 * Props (example):
 * - courses: Array of selected course objects
 * - onGenerate: function called when user triggers generation
 */
const ScheduleGenerator = ({ courses = [], onGenerate }) => {
  // create a derived array of integers with the same length as `courses`.
  // Default to an array of zeros: [0, 0, 0, ...]. This is useful when you
  // want a per-course numeric slot initialized to 0.
  const [schedules, setSchedules] = React.useState([]);

  const indices = React.useMemo(
    () => Array.from({ length: (courses && courses.length) || 0 }, () => 0),
    [courses && courses.length]
  );

  // Keep a stateful copy if you want to mutate per-course integers later.
  const [intArray, setIntArray] = React.useState(indices);

  React.useEffect(() => {
    setIntArray(indices);
  }, [indices]);

  /**
   * Scheduling helpers
   *
   * Assumptions about data shape (adjust if your project uses different keys):
   * - Each course object has a `selected_sections` array (may be empty).
   * - Each section object has a `meeting_times` (or `times`) array describing
   *   the individual class meetings for that section. Each meeting should
   *   include a `days` field (string like "M"/"Tu"/"W" or array of day codes)
   *   and `start`/`end` times as "HH:MM" strings or number of minutes.
   *
   * Example meeting: { days: ["Mon","Wed"], start: "09:00", end: "10:15" }
   */

  const toMinutes = (t) => {
    if (typeof t === "number") return t;
    if (typeof t !== "string") return NaN;
    // parse formats like "9:00 AM" or "12:10 PM"
    const m = t.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (!m) return NaN;
    let hh = parseInt(m[1], 10);
    const mm = parseInt(m[2], 10);
    const ampm = m[3] ? m[3].toUpperCase() : null;
    if (ampm === "PM" && hh !== 12) hh += 12;
    if (ampm === "AM" && hh === 12) hh = 0;
    return hh * 60 + mm;
  };

  const meetingsForSection = (section) => {
    // Normalize from your provided shape: section.lecture_info contains info0, info1, ...
    const rawObj =
      section.lecture_info || section.meeting_times || section.times || {};
    const raw = Array.isArray(rawObj) ? rawObj : Object.values(rawObj || {});

    const dayMap = (label) => {
      if (!label || typeof label !== "string") return [];
      const s = label.trim();
      if (/async|asynchron/i.test(s)) return [];
      // split by common separators
      const parts = s
        .split(/[\/,&]| and |\s+and\s+/i)
        .map((p) => p.trim())
        .filter(Boolean);
      // map full day names to short codes
      return parts.map((p) => {
        const low = p.toLowerCase();
        if (low.startsWith("mon")) return "Mon";
        if (low.startsWith("tue")) return "Tue";
        if (low.startsWith("wed")) return "Wed";
        if (low.startsWith("thu")) return "Thu";
        if (low.startsWith("fri")) return "Fri";
        if (low.startsWith("sat")) return "Sat";
        if (low.startsWith("sun")) return "Sun";
        return p;
      });
    };

    return raw
      .map((mt) => {
        const dayLabel = mt.lectureDay || mt.days || mt.day || "";
        const timeLabel = mt.lectureTime || mt.time || mt.timeslot || "";
        if (!timeLabel || timeLabel === -1) return null; // skip asynchronous/no-time

        // parse time range like "10:20 AM - 11:40 AM"
        const m = String(timeLabel).match(
          /(\d{1,2}:\d{2}\s*(?:AM|PM)?)\s*-\s*(\d{1,2}:\d{2}\s*(?:AM|PM)?)/i
        );
        if (!m) return null;
        const start = toMinutes(m[1]);
        const end = toMinutes(m[2]);
        const days = dayMap(dayLabel);
        return { days, start, end };
      })
      .filter(Boolean);
  };

  const overlaps = (aStart, aEnd, bStart, bEnd) => {
    return aStart < bEnd && bStart < aEnd;
  };

  const sectionsConflict = (s1, s2) => {
    const m1 = meetingsForSection(s1);
    const m2 = meetingsForSection(s2);
    for (const a of m1) {
      for (const b of m2) {
        // if they share any day
        const shareDay = a.days.some((d) => b.days.includes(d));
        if (shareDay && overlaps(a.start, a.end, b.start, b.end)) return true;
      }
    }
    return false;
  };

  // Backtracking generator (more efficient than building full cartesian product)
  const generateSchedules = ({ maxResults = 2000 } = {}) => {
    const options = courses.map((c) => c.selected_sections || []);
    if (options.some((o) => !o || o.length === 0)) {
      setSchedules([]);
      return [];
    }

    const results = [];
    const partial = [];

    const dfs = (idx) => {
      if (results.length >= maxResults) return; // cap
      if (idx === options.length) {
        results.push([...partial]);
        return;
      }
      for (const section of options[idx]) {
        // check against chosen partial
        let conflict = false;
        for (let i = 0; i < partial.length; i++) {
          if (sectionsConflict(partial[i], section)) {
            conflict = true;
            break;
          }
        }
        if (!conflict) {
          partial.push(section);
          dfs(idx + 1);
          partial.pop();
          if (results.length >= maxResults) return;
        }
      }
    };

    dfs(0);
    setSchedules(results);
    return results;
  };

  return (
    <div className="schedule-generator">
      <header className="schedule-generator__header">
        <h2>Schedule Generator</h2>
      </header>

      <main className="schedule-generator__body">
        <p>
          {courses && courses.length
            ? `${courses.length} courses selected`
            : "No courses selected"}
        </p>
        <button
          type="button"
          className="schedule-generator__generate-button"
          onClick={() => {
            const valid = generateSchedules();
            if (onGenerate) onGenerate(valid);
          }}
        >
          Generate Schedule
        </button>

        <div style={{ marginTop: 12 }}>
          <strong>Found schedules:</strong> {schedules.length}
          {schedules.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <em>First schedule preview (section ids or indexes):</em>
              <pre style={{ whiteSpace: "pre-wrap", marginTop: 6 }}>
                {JSON.stringify(
                  schedules[0].map(
                    (s) =>
                      s.section_number || s.index_number || s.id || "<section>"
                  ),
                  null,
                  2
                )}
              </pre>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

ScheduleGenerator.propTypes = {
  courses: PropTypes.array,
  onGenerate: PropTypes.func,
};

export default ScheduleGenerator;
