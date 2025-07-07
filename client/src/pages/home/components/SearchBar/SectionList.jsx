import React from 'react';
import "./search.css";
import { Section } from './Section';

export const SectionList = ({sections, selectedSections, setSelectedSections, setPreviewSection, courseInfo, specialFilters}) => {
    return (
        <div className="section-list">
            {
                sections.map((section, id) => {
                    const campusList = Object.values(section.lecture_info)
                        .map(infoObj => infoObj.campus)
                        .filter(Boolean);

                    // If any campus in campusList is not in specialFilters.campus, skip this section
                    if (
                        campusList.some(campus => !specialFilters.campus.includes(campus)) ||
                        (specialFilters.campus.length > 0 && !campusList.some(campus => specialFilters.campus.includes(campus)))
                    ) {
                        return null;
                    }

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