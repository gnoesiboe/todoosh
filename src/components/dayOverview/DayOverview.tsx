import React from 'react';
import Todo from '../todo/Todo';
import { Todo as TodoModel, TodoCollection } from '../../model/todo';
import TodoOverview from './components/TodoOverview';
import { formatDistanceFromToday } from '../../utility/dateTImeHelper';

export type OnTodoChangeCallback = (
    todo: TodoModel,
    field: string,
    newValue: any
) => void;

type Props = {
    onTodoChange: OnTodoChangeCallback;
    date: Date;
};

const todos: TodoCollection = [];

const DayOverview = ({ onTodoChange, date }: Props) => (
    <div>
        <h3>{formatDistanceFromToday(date)}</h3>
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

export default DayOverview;
