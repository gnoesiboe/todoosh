import React from 'react';
import Todo from '../todo/Todo';
import { Todo as TodoModel } from '../../model/todo';
import TodoOverview from './components/TodoOverview';
import withTodosFactory, {
    AddedProps as WithTodosAddedProps,
    TodoSelector,
} from './../hoc/withTodos';
import {
    formatDistanceFromToday,
    createDate,
    checkIsSameDay,
} from '../../utility/dateTImeHelper';

export type OnTodoChangeCallback = (
    todo: TodoModel,
    field: string,
    newValue: any
) => void;

type Props = {
    onTodoChange: OnTodoChangeCallback;
    date: Date;
} & WithTodosAddedProps;

const DayOverview = ({ onTodoChange, todos, date }: Props) => (
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

const todoSelector: TodoSelector = (props, todo) => {
    // @ts-ignore
    const propsDateAsString: string = props.date;

    const currentDate = createDate(propsDateAsString);
    const todoDate = createDate(todo.date);

    return checkIsSameDay(currentDate, todoDate);
};

const withTodos = withTodosFactory(todoSelector);

export default withTodos<Props>(DayOverview);
