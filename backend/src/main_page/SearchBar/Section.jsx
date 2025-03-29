import React from 'react';
import "./Section.css";


export const Section = ({section}) => {



    return (
        <div className="section">
            <p>Section Number: {section.section_number}</p>
            <p>Index Number: {section.index_number}</p>
            <p>Instructor: {section.instructor}</p>
        </div>
    )

};