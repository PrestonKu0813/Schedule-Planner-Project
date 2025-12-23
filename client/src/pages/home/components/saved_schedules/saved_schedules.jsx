import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import {
  getSavedSchedules,
  loadScheduleByIndices,
  deleteScheudle,
} from "../api";
import { useSchedule } from "../../../../contexts/ScheduleContext";
import "./saved_schedules.css";

const SavedSchedules = forwardRef(({ user, onScheduleStateChange }, ref) => {
  const { courses, setCourses, setGeneratedCourses } = useSchedule();
  const [savedSchedules, setSavedSchedules] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [deletingSchedule, setDeletingSchedule] = useState(null);
  // Cache to store the previous courses state before loading a saved schedule
  const previousCoursesCache = useRef(null);

  useEffect(() => {
    if (user && user.user_id) {
      loadSavedSchedules();
    } else if (user && user.id) {
      loadSavedSchedules();
    }
  }, [user]);

  const loadSavedSchedules = async () => {
    const userId = user?.user_id || user?.id;
    if (!user || !userId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const schedules = await getSavedSchedules(userId);
      setSavedSchedules(schedules);
    } catch (err) {
      setError("Failed to load saved schedules");
    } finally {
      setLoading(false);
    }
  };

  // Expose loadSavedSchedules function and currentSchedule state to parent component via ref
  useImperativeHandle(ref, () => ({
    loadSavedSchedules,
    currentSchedule, // Expose currentSchedule so parent can check if a saved schedule is active
  }));

  const handleScheduleClick = async (scheduleName, scheduleIndices) => {
    // If clicking on the same schedule that's already selected, deselect it
    if (currentSchedule === scheduleName) {
      // Restore the previous courses state from cache, or clear if no cache exists
      if (previousCoursesCache.current !== null) {
        setCourses(previousCoursesCache.current);
        // Clear generatedCourses - it will be set by the generator when it runs again
        // (since isSavedScheduleActive will become false, triggering auto-generation)
        setGeneratedCourses([]);
        previousCoursesCache.current = null; // Clear cache after restoring
      } else {
        // Fallback: clear calendar if no previous state was cached
        setCourses([]);
        setGeneratedCourses([]);
      }
      setCurrentSchedule(null);
      // Notify parent component that saved schedule state changed
      if (onScheduleStateChange) {
        onScheduleStateChange(null);
      }
      return;
    }

    try {
      // Save current courses state to cache before loading the saved schedule
      // This allows restoring the previous state when deselecting the saved schedule
      // Deep copy to avoid reference issues
      previousCoursesCache.current = JSON.parse(JSON.stringify(courses));

      // Load the schedule from the server
      const loadedCourses = await loadScheduleByIndices(scheduleIndices);

      // Set the courses in the main state to display on calendar
      setCourses(loadedCourses);
      
      // Also update generatedCourses so the calendar displays the saved schedule
      // (since auto-generation is disabled when viewing saved schedules)
      setGeneratedCourses(loadedCourses);

      // Set current schedule
      setCurrentSchedule(scheduleName);
      // Notify parent component that saved schedule state changed
      if (onScheduleStateChange) {
        onScheduleStateChange(scheduleName);
      }
    } catch (err) {
      alert("Failed to load schedule. Please try again.");
      // If loading failed, don't clear cache - keep it for next attempt
    }
  };

  const handleDeleteSchedule = async (scheduleName) => {
    const userId = user?.user_id || user?.id;
    if (!userId) return;
    setDeletingSchedule(scheduleName);
    setError(null);
    try {
      await deleteScheudle(userId, scheduleName);
      await loadSavedSchedules();
    } catch (err) {
      setError(
        "Failed to delete schedule: " + (err?.message || "Unknown error")
      );
    } finally {
      setDeletingSchedule(null);
    }
  };

  const formatScheduleName = (name) => {
    return name.replace(/_/g, " ");
  };

  // Helper to get the actual key for a schedule (in case display formatting changes)
  const getScheduleKey = (scheduleName) => scheduleName;

  if (loading) {
    return (
      <div className="saved-schedules-container">
        <h3>Saved Schedules</h3>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="saved-schedules-container">
        <h3>Saved Schedules</h3>
        <div className="error" style={{ color: "red", marginBottom: "8px" }}>
          {error}
        </div>
        <button onClick={loadSavedSchedules} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  const scheduleNames = Object.keys(savedSchedules);

  return (
    <div className="saved-schedules-container">
      <h3>Saved Schedules</h3>
      {scheduleNames.length === 0 ? (
        <div className="no-schedules">
          <p>No Saved Schedules</p>
        </div>
      ) : (
        <div className="schedules-list">
          {scheduleNames.map((scheduleName) => (
            <div
              key={scheduleName}
              className={`schedule-item ${currentSchedule === scheduleName ? "current-schedule" : ""}`}
              onClick={() =>
                handleScheduleClick(scheduleName, savedSchedules[scheduleName])
              }
            >
              <div className="schedule-name">
                {formatScheduleName(scheduleName)}
              </div>
              <div className="schedule-info">
                {savedSchedules[scheduleName].length} sections
              </div>
              <button
                className="delete-schedule-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteSchedule(getScheduleKey(scheduleName));
                }}
                disabled={deletingSchedule === scheduleName}
              >
                {deletingSchedule === scheduleName ? "Deleting..." : "Delete"}
              </button>
              {currentSchedule === scheduleName}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default SavedSchedules;
