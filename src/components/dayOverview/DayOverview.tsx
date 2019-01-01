import React from 'react';
import Todo from '../todo/Todo';
import { Todo as TodoModel } from '../../model/todo';
import TodoOverview from './components/TodoOverview';
import { formatDistanceFromToday } from '../../utility/dateTImeHelper';
import createClassName from 'classnames';
import './DayOverview.scss';

export type OnTodoCompletedChangeCallback = (
    todo: TodoModel,
    date: Date,
    completed: boolean
) => void;

type Props = {
    onTodoCompletedChange: OnTodoCompletedChangeCallback;
    date: Date;
    isCurrent: boolean;
    currentTodoIndex: number;
    children?: JSX.Element;
    todos: TodoModel[];
};

const DayOverview = ({
    onTodoCompletedChange,
    date,
    isCurrent,
    children,
    todos,
    currentTodoIndex,
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
                {todos.map((todo, index) => (
                    <Todo
                        key={todo.id}
                        todo={todo}
                        isCurrent={isCurrent && index === currentTodoIndex}
                        onCompletedChange={complete =>
                            onTodoCompletedChange(todo, date, complete)
                        }
                    />
                ))}
            </TodoOverview>
        </div>
    );
};

export default DayOverview;
