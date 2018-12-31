import React from 'react';
import Todo from '../todo/Todo';
import { Todo as TodoModel, TodoCollection } from '../../model/todo';
import TodoOverview from './components/TodoOverview';
import { formatDistanceFromToday } from '../../utility/dateTImeHelper';
import createClassName from 'classnames';
import './DayOverview.scss';

export type OnTodoChangeCallback = (
    todo: TodoModel,
    field: string,
    newValue: any
) => void;

type Props = {
    onTodoChange: OnTodoChangeCallback;
    date: Date;
    isCurrent: boolean;
    children?: JSX.Element;
    todos: TodoCollection;
};

const DayOverview = ({
    onTodoChange,
    date,
    isCurrent,
    children,
    todos,
}: Props) => {
    const className = createClassName('day-overview', {
        'day-overview__current': isCurrent,
    });

    return (
        <div className={className}>
            <h3 className="day-overview--title">
                {formatDistanceFromToday(date)}
            </h3>
            {children}
            <TodoOverview>
                {todos.map(todo => (
                    <Todo
                        key={todo.id}
                        todo={todo}
                        onChange={(field, newValue) =>
                            onTodoChange(todo, field, newValue)
                        }
                    />
                ))}
            </TodoOverview>
        </div>
    );
};

export default DayOverview;
