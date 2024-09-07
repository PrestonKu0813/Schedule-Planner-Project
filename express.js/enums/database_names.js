module.exports = {
  table: {
    SUBJECT: "subject",
    COURSE: "course",
    SECTION: "section",
    USER: {
      MAIN: "main_user",
      GOOGLE: "google_user",
    },
  },
  subject: {
    CODE: "subject_code",
    NAME: "subject_name",
  },
  course: {
    NUMBER: "course_number",
    NAME: "course_name",
    CREDIT: "credit",
    CORE_CODE: "core_code",
  },
  section: {
    INDEX: "index_number",
    NUMBER: "section_number",
    INSTRUCTOR: "instructor",
    INFO: "lecture_info",
  },
  user: {
    MAIN: {
      ID: "user_id",
      PASSWORD: "password",
      NAME: "name",
      SESSION: "session",
    },
    GOOGLE: {
      ID: "user_id",
      GOOGLE_ID: "google_id",
      NAME: "name",
      SESSION: "session",
    },
  },
};
