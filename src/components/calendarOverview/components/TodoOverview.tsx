import React from 'react';
import uuid from 'uuid/v4';

type Props = {
    children: JSX.Element[];
};

const TodoOverview = ({ children }: Props) => (
    <ul className="list-unstyled">
        {React.Children.map(children, child => (
            <li key={child.key || uuid()}>{child}</li>
        ))}
    </ul>
);

export default TodoOverview;
