import { createContext, useContext, useState } from "react";

export const ScheduleContext = createContext();

export function ScheduleProvider({ children }) {
  const [courses, setCourses] = useState([]);
  const [info, setInfo] = useState({});
  const [activeTab, setActiveTab] = useState("SEARCH");
  const [previewSection, setPreviewSection] = useState(null);

  return (
    <ScheduleContext.Provider
      value={{
        courses,
        setCourses,
        info,
        setInfo,
        activeTab,
        setActiveTab,
        previewSection,
        setPreviewSection,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
}

export function useSchedule() {
  return useContext(ScheduleContext);
}
