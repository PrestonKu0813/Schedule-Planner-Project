import { createContext, useContext, useState } from "react";

export const ScheduleContext = createContext();

export function ScheduleProvider({ children }) {
  const [courses, setCourses] = useState([]);
  const [info, setInfo] = useState(null);
  const [activeTab, setActiveTab] = useState("SEARCH");
  const [previewSection, setPreviewSection] = useState(null);

  // Temporary storage for user's work-in-progress schedule
  const [tempUserSchedule, setTempUserSchedule] = useState(null);
  const [isViewingSavedSchedule, setIsViewingSavedSchedule] = useState(false);

  // Enhanced setCourses function that handles temporary storage
  const setCoursesWithTempStorage = (
    newCourses,
    isFromSavedSchedule = false
  ) => {
    if (isFromSavedSchedule) {
      // If loading a saved schedule, store current user schedule temporarily
      if (!isViewingSavedSchedule && courses.length > 0) {
        setTempUserSchedule(courses);
        setIsViewingSavedSchedule(true);
      }
      setCourses(newCourses);
    } else {
      // If setting courses from user interaction, clear saved schedule view
      if (isViewingSavedSchedule) {
        setIsViewingSavedSchedule(false);
        setTempUserSchedule(null);
      }
      setCourses(newCourses);
    }
  };

  // Function to restore user's work-in-progress schedule
  const restoreUserSchedule = () => {
    if (tempUserSchedule) {
      setCourses(tempUserSchedule);
      setTempUserSchedule(null);
      setIsViewingSavedSchedule(false);
    }
  };

  return (
    <ScheduleContext.Provider
      value={{
        courses,
        setCourses: setCoursesWithTempStorage,
        info,
        setInfo,
        activeTab,
        setActiveTab,
        previewSection,
        setPreviewSection,
        tempUserSchedule,
        isViewingSavedSchedule,
        restoreUserSchedule,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
}

export function useSchedule() {
  return useContext(ScheduleContext);
}
