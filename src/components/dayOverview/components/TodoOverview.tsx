import React from 'react';
import uuid from 'uuid/v4';

type Props = {
    children: JSX.Element[];
};

const TodoOverview = ({ children }: Props) => {
    return (
        <ul className="list-unstyled">
            {React.Children.map(children, child => {
                const key = child.key || uuid();

                return <li key={key}>{child}</li>;
            })}
        </ul>
    );
};

export default TodoOverview;
