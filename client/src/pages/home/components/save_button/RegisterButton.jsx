import React from 'react';
import './save_button.css';

const RegisterButton = ({ courses }) => {
  // Helper to extract all selected section index numbers from courses
  const getIndexList = () => {
    if (!courses || !Array.isArray(courses)) return [];
    return courses
      .flatMap(course => (course.selected_sections || []))
      .map(section => section.index_number)
      .filter(Boolean);
  };

  const handleRegister = () => {
    const indexList = getIndexList();
    if (indexList.length === 0) {
      alert('No sections selected to register.');
      return;
    }
    //SEMESTER SELECTION IS HARDCODED 
    const semesterSelection = '92025';
    const url = `https://sims.rutgers.edu/webreg/editSchedule.htm?login=cas&semesterSelection=${semesterSelection}&indexList=${indexList.join(',')}`;
    window.open(url, '_blank');
  };

  return (
    <button 
      className="save-button"
      style={{ marginLeft: '8px' }}
      onClick={handleRegister}
    >
      Register
    </button>
  );
};

export default RegisterButton; 