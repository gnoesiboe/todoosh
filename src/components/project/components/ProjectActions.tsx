import React from 'react';
import './ProjectActions.scss';

type Props = {
    children: JSX.Element[];
};

const ProjectActions = ({ children }: Props) => (
    <ul className="project--actions list-inline">
        {React.Children.map(children, child => (
            <li className="project--action list-inline-item">{child}</li>
        ))}
    </ul>
);

export default ProjectActions;
