import React from 'react';

const ClassPopup = ({ selectedClass, onClose }) => {
  if (!selectedClass) return null;

  return (
    <div
      className="popup"
      style={{ top: selectedClass.popupY, left: selectedClass.popupX }}
    >
      <button className="popup-close" onClick={onClose}>
        &times;
      </button>
      <h2>{selectedClass.title}</h2>
      
      {selectedClass.isOnline ? (
        // Online section popup content
        <>
          <p>
            <strong>Format:</strong> Online
          </p>
          <p>
            <strong>Section:</strong> {selectedClass.section_number}
          </p>
          <p>
            <strong>Instructor:</strong> {selectedClass.instructor}
          </p>
          <p>
            <strong>Course Number:</strong> {selectedClass.course_number}
          </p>
          <p>
            <strong>Credits:</strong> {selectedClass.credits || "N/A"}
          </p>
          <p>
            <strong>Core Code:</strong> {selectedClass.core_code}
          </p>
        </>
      ) : (
        // Regular section popup content
        <>
          <p>
            <strong>Day:</strong> {selectedClass.day}
          </p>
          <p>
            <strong>Time:</strong> {selectedClass.start} - {selectedClass.end}
          </p>
          <p>
            <strong>Core Code:</strong> {selectedClass.core_code}
          </p>
          <p>
            <strong>Section:</strong> {selectedClass.section_number}
          </p>
          <p>
            <strong>Instructor:</strong> {selectedClass.instructor}
          </p>
          <p>
            <strong>Campus:</strong> {selectedClass.campus}
          </p>
          <p>
            <strong>Classroom:</strong>{" "}
            <a
              href={selectedClass.classroomLink}
              target="_blank"
              rel="noreferrer"
            >
              {selectedClass.classroom}
            </a>
          </p>
          {selectedClass.recitation ? (
            <p>
              <strong>Recitation:</strong> {selectedClass.recitation}
            </p>
          ) : null}
        </>
      )}
    </div>
  );
};

export default ClassPopup; 