import React from 'react';
import "./SectionList.css";
import { Section } from './Section';

export const SectionList = ({sections, selectedSections, setSelectedSections}) => {
    return (
        <div className="section-list">
            {
                sections.map((section, id) => {
                    return <Section section={section} key={id} selectedSections={selectedSections} setSelectedSections={setSelectedSections}/>;
                })
            }
        </div>
    )
}