import React from 'react';
import './TodoActions.scss';

type Props = {
    children: JSX.Element[] | JSX.Element;
};

const TodoActions = ({ children }: Props) => (
    <div className="todo--actions">
        <ul className="list-inline">
            {React.Children.map(children, child => (
                <li className="todo--action list-inline-item">{child}</li>
            ))}
        </ul>
    </div>
);

export default TodoActions;
