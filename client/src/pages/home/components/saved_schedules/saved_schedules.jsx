import React, { useState, useEffect } from 'react';
import { getSavedSchedules, loadScheduleByIndices, deleteScheudle } from '../api';
import './saved_schedules.css';

const SavedSchedules = ({ user, setCourses, courses }) => {
  const [savedSchedules, setSavedSchedules] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [deletingSchedule, setDeletingSchedule] = useState(null);

  useEffect(() => {
    // console.log("🛠️ [SavedSchedules] User data:", user);
    // console.log("🛠️ [SavedSchedules] User keys:", user ? Object.keys(user) : 'No user');
    
    if (user && user.user_id) {
      // console.log("🛠️ [SavedSchedules] Loading schedules for user:", user.user_id);
      loadSavedSchedules();
    } else if (user && user.id) {
      // console.log("🛠️ [SavedSchedules] Loading schedules for user (using id):", user.id);
      loadSavedSchedules();
    } else {
      // console.log("🛠️ [SavedSchedules] No user or user_id found");
      // console.log("🛠️ [SavedSchedules] User object:", user);
    }
  }, [user]);

  const loadSavedSchedules = async () => {
    const userId = user?.user_id || user?.id;
    if (!user || !userId) {
      // console.log("🛠️ [SavedSchedules] No user or userId found in loadSavedSchedules");
      // console.log("🛠️ [SavedSchedules] User object:", user);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // console.log("🛠️ [SavedSchedules] Calling getSavedSchedules with userId:", userId);
      // console.log("🛠️ [SavedSchedules] User authentication status:", user);
      const schedules = await getSavedSchedules(userId);
      // console.log("🛠️ [SavedSchedules] Received schedules:", schedules);
      setSavedSchedules(schedules);
    } catch (err) {
      // console.error('🛠️ [SavedSchedules] Failed to load saved schedules:', err);
      // console.error('🛠️ [SavedSchedules] Error details:', err);
      setError('Failed to load saved schedules');
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleClick = async (scheduleName, scheduleIndices) => {
    try {
      // console.log('🛠️ [SavedSchedules] Loading schedule:', scheduleName, scheduleIndices);
      
      // Load the schedule from the server
      const courses = await loadScheduleByIndices(scheduleIndices);
      // console.log('🛠️ [SavedSchedules] Loaded courses:', courses);
      
      // Set the courses in the main state to display on calendar
      setCourses(courses);
      
      // Set current schedule
      setCurrentSchedule(scheduleName);
    } catch (err) {
      // console.error('🛠️ [SavedSchedules] Failed to load schedule:', err);
      alert('Failed to load schedule. Please try again.');
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
      setError('Failed to delete schedule: ' + (err?.message || 'Unknown error'));
    } finally {
      setDeletingSchedule(null);
    }
  };

  const formatScheduleName = (name) => {
    return name.replace(/_/g, ' ');
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
        <div className="error" style={{ color: 'red', marginBottom: '8px' }}>{error}</div>
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
          <p>No saved schedules found.</p>
          <p>Save a schedule using the "Save Schedule" button!</p>
        </div>
      ) : (
        <div className="schedules-list">
          {scheduleNames.map((scheduleName) => (
            <div
              key={scheduleName}
              className={`schedule-item ${currentSchedule === scheduleName ? 'current-schedule' : ''}`}
              onClick={() => handleScheduleClick(scheduleName, savedSchedules[scheduleName])}
            >
              <div className="schedule-name">
                {formatScheduleName(scheduleName)}
              </div>
              <div className="schedule-info">
                {savedSchedules[scheduleName].length} sections
              </div>
              <button
                className="delete-schedule-button"
                onClick={e => {
                  e.stopPropagation();
                  handleDeleteSchedule(getScheduleKey(scheduleName));
                }}
                style={{ marginTop: '4px', color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}
                disabled={deletingSchedule === scheduleName}
              >
                {deletingSchedule === scheduleName ? 'Deleting...' : 'Delete'}
              </button>
              {currentSchedule === scheduleName }
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedSchedules; 