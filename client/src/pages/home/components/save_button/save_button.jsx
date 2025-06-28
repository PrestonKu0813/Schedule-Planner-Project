import React, { useState } from 'react';
import './save_button.css';
import { savedScheudle } from '../api';

const SaveButton = ({ courses, user }) => {
  const [scheduleName, setScheduleName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showInput, setShowInput] = useState(false);

  // Convert current schedule to indices that can be saved
  const convertScheduleToIndices = () => {
    const scheduleIndices = [];
    
    courses.forEach(course => {
      course.selected_sections.forEach(section => {
        scheduleIndices.push(section.index_number);
      });
    });
    
    return scheduleIndices;
  };

  const handleSave = async () => {
    console.log("🛠️ [SaveButton] handleSave called");
    console.log("🛠️ [SaveButton] user data:", user);
    console.log("🛠️ [SaveButton] courses data:", courses);
    
    if (!scheduleName.trim()) {
      alert('Please enter a schedule name');
      return;
    }

    // Validate schedule name - must be a valid JSON key
    const trimmedName = scheduleName.trim();
    if (!/^[a-zA-Z_][a-zA-Z0-9_\s]*$/.test(trimmedName)) {
      alert('Schedule name must start with a letter or underscore and contain only letters, numbers, underscores, and spaces');
      return;
    }

    // Convert spaces to underscores for JSON key compatibility
    const jsonKeyName = trimmedName.replace(/\s+/g, '_');

    if (!user || !user.user_id) {
      console.log("🛠️ [SaveButton] User validation failed - user:", user);
      alert('User information not available');
      return;
    }

    if (courses.length === 0) {
      alert('No courses selected to save');
      return;
    }

    setIsSaving(true);
    
    try {
      const scheduleIndices = convertScheduleToIndices();
      console.log("🛠️ [SaveButton] Schedule indices:", scheduleIndices);
      console.log("🛠️ [SaveButton] Calling API with:", {
        userId: user.user_id,
        scheduleName: jsonKeyName,
        scheduleIndices: scheduleIndices
      });
      await savedScheudle(user.user_id, jsonKeyName, scheduleIndices);
      alert('Schedule saved successfully!');
      setScheduleName('');
      setShowInput(false);
    } catch (error) {
      console.error('🛠️ [SaveButton] Detailed error:', error);
      console.error('🛠️ [SaveButton] Error response:', error.response);
      console.error('🛠️ [SaveButton] Error message:', error.message);
      alert('Failed to save schedule. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveClick = () => {
    if (courses.length === 0) {
      alert('No courses selected to save');
      return;
    }
    setShowInput(true);
  };

  const handleCancel = () => {
    setScheduleName('');
    setShowInput(false);
  };

  return (
    <div className="save-button-container">
      {!showInput ? (
        <button 
          className="save-button"
          onClick={handleSaveClick}
        >
          Save Schedule
        </button>
      ) : (
        <div className="save-input-container">
          <input
            type="text"
            placeholder="Enter schedule name..."
            value={scheduleName}
            onChange={(e) => setScheduleName(e.target.value)}
            className="schedule-name-input"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSave();
              }
            }}
          />
          <div className="save-actions">
            <button 
              className="save-confirm-button"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button 
              className="save-cancel-button"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SaveButton; 