import { createAction } from 'typesafe-actions';
import { Todo } from '../../../model/todo';
import uuid from 'uuid/v4';
import { formatDate } from '../../../utility/dateTImeHelper';

export const createAddTodoAction = createAction(
    '@todos/create',
    resolve => (title: string, date: Date, isCompleted: boolean = false) =>
        resolve({
            todo: {
                id: uuid(),
                title,
                isCompleted,
            } as Todo,
            date: formatDate(date) as string,
        })
);

export const createToggleTodoCompletedAction = createAction(
    '@todos/toggle-completed',
    resolve => (id: string, date: string, completed: boolean) =>
        resolve({ id, date, completed })
);

export const createUpdateTodoAction = createAction(
    '@todos/update',
    resolve => (id: string, date: string, title: string) =>
        resolve({ id, title, date })
);

export const createDeleteTodoAction = createAction(
    '@todos/delete',
    resolve => (id: string, date: string) => resolve({ id, date })
);
