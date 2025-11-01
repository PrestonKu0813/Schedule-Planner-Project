// Sample runner for the schedule generator
// Run: node ./client/scripts/run_schedule_sample.js

function toMinutes(t) {
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
}

function dayMap(label) {
  if (!label || typeof label !== "string") return [];
  const s = label.trim();
  if (/async|asynchron/i.test(s)) return [];
  const parts = s
    .split(/[/\\,&]| and |\s+and\s+/i)
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
}

function meetingsForSection(section) {
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
}

function overlaps(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
}

function sectionsConflict(s1, s2) {
  const m1 = meetingsForSection(s1);
  const m2 = meetingsForSection(s2);
  for (const a of m1) {
    for (const b of m2) {
      const shareDay = a.days.some((d) => b.days.includes(d));
      if (shareDay && overlaps(a.start, a.end, b.start, b.end)) return true;
    }
  }
  return false;
}

function generateSchedules(courses, { maxResults = 2000 } = {}) {
  const options = courses.map((c) => c.selected_sections || []);
  if (options.some((o) => !o || o.length === 0)) return [];
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
}

// Sample input based on your provided object, simplified into an array of courses.
const sampleCourse = {
  course_number: "33:010:272",
  course_name: "INTRODUCTION TO FINANCIAL ACCOUNTING",
  credit: 3,
  core_code: "-1",
  selected_sections: Object.values({
    17737: {
      index_number: "17737",
      section_number: "01",
      lecture_info: {
        info0: { lectureDay: "Saturday", lectureTime: "9:00 AM - 12:00 PM" },
        info1: { lectureDay: "Asynchronous content", lectureTime: -1 },
      },
    },
    17738: {
      index_number: "17738",
      section_number: "02",
      lecture_info: {
        info0: { lectureDay: "Monday", lectureTime: "10:20 AM - 11:40 AM" },
        info1: { lectureDay: "Thursday", lectureTime: "10:20 AM - 11:40 AM" },
      },
    },
    17739: {
      index_number: "17739",
      section_number: "03",
      lecture_info: {
        info0: { lectureDay: "Monday", lectureTime: "3:50 PM - 5:10 PM" },
        info1: { lectureDay: "Wednesday", lectureTime: "3:50 PM - 5:10 PM" },
      },
    },
    // (trimmed for brevity)
  }),
};

// For demonstration, create two courses so generator can combine across courses.
const courseA = sampleCourse;
const courseB = {
  course_number: "01:123:456",
  course_name: "SAMPLE COURSE B",
  selected_sections: [
    {
      section_number: "A1",
      lecture_info: {
        info0: { lectureDay: "Monday", lectureTime: "9:00 AM - 10:15 AM" },
      },
    },
    {
      section_number: "A2",
      lecture_info: {
        info0: { lectureDay: "Monday", lectureTime: "10:20 AM - 11:40 AM" },
      },
    },
  ],
};

const courses = [courseA, courseB];

const schedules = generateSchedules(courses, { maxResults: 50 });
console.log("Found schedules count:", schedules.length);
if (schedules.length > 0) {
  console.log(
    "Sample schedule (section numbers):",
    schedules[0].map((s) => s.section_number || s.index_number)
  );
} else {
  console.log("No conflict-free schedules found for sample data.");
}
