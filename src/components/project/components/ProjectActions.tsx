import React from 'react';
import './ProjectActions.scss';

type Props = {
    children: JSX.Element[];
};

const ProjectActions = ({ children }: Props) => (
    <ul className="project--actions">
        {React.Children.map(children, child => (
            <span className="project--action list-inline-item">{child}</span>
        ))}
    </ul>
);

export default ProjectActions;
