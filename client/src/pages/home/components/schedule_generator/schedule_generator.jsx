import React from "react";
import PropTypes from "prop-types";

const toMinutes = (t) => {
  if (typeof t === "number") return t;
  if (typeof t !== "string") return NaN;
  const m = t.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!m) return NaN;
  let hh = parseInt(m[1], 10);
  const mm = parseInt(m[2], 10);
  const ampm = m[3] ? m[3].toUpperCase() : null;
  if (ampm === "PM" && hh !== 12) hh += 12;
  if (ampm === "AM" && hh === 12) hh = 0;
  return hh * 60 + mm;
};

const dayMap = (label) => {
  if (!label || typeof label !== "string") return [];
  const s = label.trim();
  if (/async|asynchron/i.test(s)) return [];
  const parts = s
    .split(/[\/,&]| and |\s+and\s+/i)
    .map((p) => p.trim())
    .filter(Boolean);
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

const meetingsForSection = (section) => {
  const rawObj =
    section.lecture_info || section.meeting_times || section.times || {};
  const raw = Array.isArray(rawObj) ? rawObj : Object.values(rawObj || {});

  return raw
    .map((mt) => {
      const dayLabel = mt.lectureDay || mt.days || mt.day || "";
      const timeLabel = mt.lectureTime || mt.time || mt.timeslot || "";
      if (!timeLabel || timeLabel === -1) return null;
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
      const shareDay = a.days.some((d) => b.days.includes(d));
      if (shareDay && overlaps(a.start, a.end, b.start, b.end)) return true;
    }
  }
  return false;
};

export const generateSchedulesFromCourses = (
  courses = [],
  { maxResults = 2000 } = {}
) => {
  if (!courses || courses.length === 0) {
    return [];
  }

  const options = courses.map((c) => {
    const sections = c.selected_sections || [];
    return sections.map((section) => ({
      ...section,
      course_number: section.course_number || c.course_number,
      _course_metadata: {
        course_number: c.course_number,
        course_name: c.course_name,
        credit: c.credit,
        core_code: c.core_code,
        subject_code: c.subject_code,
        course_link: c.course_link,
      },
    }));
  });

  if (options.some((o) => !o || o.length === 0)) {
    return [];
  }

  const results = [];
  const partial = [];

  const dfs = (idx) => {
    if (results.length >= maxResults) return;
    if (idx === options.length) {
      results.push([...partial]);
      return;
    }
    for (const section of options[idx]) {
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
  return results;
};

/**
 * ScheduleGenerator
 * A minimal template component for schedule generation UI.
 */
const ScheduleGenerator = ({
  courses = [],
  generatedSchedules = [],
  onGenerate,
}) => {
  const [schedules, setSchedules] = React.useState(generatedSchedules || []);

  React.useEffect(() => {
    setSchedules(generatedSchedules || []);
  }, [generatedSchedules]);

  const handleGenerate = React.useCallback(() => {
    const valid = generateSchedulesFromCourses(courses);
    setSchedules(valid);
    if (onGenerate) onGenerate(valid);
  }, [courses, onGenerate]);

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
          onClick={handleGenerate}
        >
          Generate Schedule
        </button>

        <div style={{ marginTop: 12 }}>
          <strong>Found schedules:</strong> {schedules.length}
          {schedules.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <em>First schedule preview (section ids or indexes):</em>
              <pre style={{ whiteSpace: "pre-wrap", marginTop: 6 }}>
                {console.log(
                  JSON.stringify(
                    schedules.map((schedule) =>
                      schedule.map((s) => s.index_number || s.id || "<section>")
                    ),
                    null,
                    2
                  )
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
  generatedSchedules: PropTypes.array,
  onGenerate: PropTypes.func,
};

export default ScheduleGenerator;
