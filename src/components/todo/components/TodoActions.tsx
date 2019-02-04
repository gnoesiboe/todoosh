import React from 'react';
import './TodoActions.scss';

type Props = {
    children: Array<JSX.Element | undefined>;
};

const TodoActions = ({ children }: Props) => (
    <div className="todo--actions">
        <ul className="list-inline">
            {React.Children.map(children, child => {
                if (!child) {
                    return null;
                }

                return (
                    <li className="todo--action list-inline-item">{child}</li>
                );
            })}
        </ul>
    </div>
);

export default TodoActions;
