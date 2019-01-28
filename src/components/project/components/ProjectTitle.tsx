import React from 'react';

type Props = {
    title: string;
    abbrevation: string;
};

const ProjectTitle = ({ title, abbrevation }: Props) => (
    <h3 className="project--title">
        {abbrevation} | {title}
    </h3>
);

export default ProjectTitle;
