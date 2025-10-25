import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  getSavedSchedules,
  loadScheduleByIndices,
  deleteScheudle,
} from "../api";
import { useSchedule } from "../../../../contexts/ScheduleContext";
import "./saved_schedules.css";

const SavedSchedules = forwardRef(({ user }, ref) => {
  const { setCourses, isViewingSavedSchedule } = useSchedule();
  const [savedSchedules, setSavedSchedules] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [deletingSchedule, setDeletingSchedule] = useState(null);

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

  // Expose loadSavedSchedules function to parent component via ref
  useImperativeHandle(ref, () => ({
    loadSavedSchedules,
  }));

  const handleScheduleClick = async (scheduleName, scheduleIndices) => {
    try {
      // Load the schedule from the server
      const courses = await loadScheduleByIndices(scheduleIndices);

      // Set the courses in the main state to display on calendar
      // Pass true to indicate this is from a saved schedule
      setCourses(courses, true);

      // Set current schedule
      setCurrentSchedule(scheduleName);
    } catch (err) {
      alert("Failed to load schedule. Please try again.");
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
