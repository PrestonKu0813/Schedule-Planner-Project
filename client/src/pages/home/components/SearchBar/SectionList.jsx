import React from 'react';
import "./search.css";
import { Section } from './Section';

export const SectionList = ({sections, selectedSections, setSelectedSections, setPreviewSection, courseInfo}) => {
    return (
        <div className="section-list">
            {
                sections.map((section, id) => {
                    return <Section 
                        section={section} 
                        key={id} 
                        selectedSections={selectedSections} 
                        setSelectedSections={setSelectedSections}
                        setPreviewSection={setPreviewSection}
                        courseInfo={courseInfo}
                    />;
                })
            }
        </div>
    )
}