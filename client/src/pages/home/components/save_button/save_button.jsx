import React from 'react';
import './save_button.css';

const SaveButton = () => {
  const handleSave = () => {
    // Placeholder for future save functionality
    console.log('Save button clicked - functionality not implemented yet');
  };

  return (
    <div className="save-button-container">
      <button 
        className="save-button"
        onClick={handleSave}
      >
        Save Schedule
      </button>
    </div>
  );
};

export default SaveButton; 