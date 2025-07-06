// Constants
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// Helper: Parse time string to 24-hour format
export const parseTimeString = (timeStr) => {
  if (!timeStr || timeStr === '-1') return null;
  const match = timeStr.match(/(\d+):(\d+) (AM|PM)/);
  if (!match) return null;
  const [_, hour, minute, period] = match;
  let hour24 = parseInt(hour, 10);
  if (period === "AM") {
    if (hour24 === 12) hour24 = 0; // 12 AM is 0
  } else {
    if (hour24 !== 12) hour24 += 12; // 12 PM is 12
  }
  return { hour: hour24, minute: parseInt(minute, 10) };
};

// Helper: Convert time string to minutes since midnight
export const timeToMinutes = (timeStr) => {
  const parsed = parseTimeString(timeStr);
  if (!parsed) return 0;
  return parsed.hour * 60 + parsed.minute;
};

// Helper: Calculate vertical position (0% at 8:00 AM, 100% at 11:00 PM)
export const calculatePosition = (time) => {
  const parsed = parseTimeString(time);
  if (!parsed) return 0;
  // Calendar starts at 8 AM, ends at 11 PM (16 hours = 960 minutes)
  const totalMinutes = (parsed.hour - 8) * 60 + parsed.minute;
  const clampedMinutes = Math.max(0, Math.min(960, totalMinutes));
  return (clampedMinutes / 960) * 100;
};

// Helper: Map day to index
export const dayToIndex = (day) => DAYS.indexOf(day);

// Helper: Check if lecture should be displayed
export const isValidLecture = (lecture) => {
  return lecture.lectureDay !== "Asynchronous content" &&
         lecture.lectureDay !== "-1" &&
         typeof lecture.lectureTime === "string" &&
         lecture.lectureTime !== "-1" &&
         lecture.lectureTime.includes(" - ");
};

// Helper: Check if a section is online
export const isOnlineSection = (section) => {
  if (!section.lecture_info) return false;
  
  const lectureInfoArray = Object.values(section.lecture_info);
  return lectureInfoArray.every(lecture => 
    lecture.lectureDay === "Asynchronous content" || 
    lecture.lectureDay === "Hours by arrangement" ||
    lecture.lectureDay === "-1" ||
    lecture.campus === "Online" ||
    lecture.campus === -1
  );
};

// Helper: Get all online sections from courses
export const getOnlineSections = (courses) => {
  const onlineSections = [];
  (courses || []).forEach(course => {
    course.selected_sections.forEach(section => {
      if (isOnlineSection(section)) {
        onlineSections.push({ course, section });
      }
    });
  });
  return onlineSections;
};

// Helper: Calculate lecture positioning
export const calculateLecturePosition = (lecture) => {
  const dayIndex = dayToIndex(lecture.lectureDay);
  const [start, end] = lecture.lectureTime.split(" - ");
  const topPos = calculatePosition(start);
  const bottomPos = calculatePosition(end);
  const heightPos = bottomPos - topPos;
  const dayLeft = 12 + dayIndex * (90 / 7);
  
  return {
    topPos,
    bottomPos,
    heightPos,
    dayLeft,
    start,
    end
  };
};

// Helper: Create class details object
export const createClassDetails = (course, section, lecture, start, end) => {
  // For online sections, create a virtual lecture object
  if (isOnlineSection(section)) {
    return {
      title: course.course_name,
      day: "Online",
      start: "Asynchronous",
      end: "Content",
      core_code: course.core_code,
      course_number: course.course_number,
      instructor: section.instructor,
      section_number: section.section_number,
      campus: "Online",
      lectureTime: "Asynchronous content",
      classroom: "Online",
      classroomLink: "#",
      recitation: null,
      isOnline: true,
      credits: course.credit
    };
  }
  
  // For regular sections, use existing logic
  return {
    title: course.course_name,
    day: lecture.lectureDay,
    start: start,
    end: end,
    core_code: course.core_code,
    course_number: course.course_number,
    instructor: section.instructor,
    section_number: section.section_number,
    campus: lecture.campus,
    lectureTime: lecture.lectureTime,
    classroom: lecture.classroom,
    classroomLink: lecture.classroomLink,
    recitation: lecture.recitation,
    isOnline: false
  };
}; 