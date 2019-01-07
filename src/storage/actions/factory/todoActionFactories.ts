import { createAction } from 'typesafe-actions';
import { Todo } from '../../../model/todo';
import uuid from 'uuid/v4';
import { formatDate } from '../../../utility/dateTImeHelper';

export const createAddTodoAction = createAction(
    '@todos/create',
    resolve => (
        title: string,
        date: Date,
        deadline: string | null = null,
        isCompleted: boolean = false
    ) =>
        resolve({
            todo: {
                id: uuid(),
                title,
                isCompleted,
                deadline,
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
    resolve => (
        id: string,
        date: string,
        title: string,
        deadline: string | null = null
    ) => resolve({ id, title, date, deadline })
);

export const createDeleteTodoAction = createAction(
    '@todos/delete',
    resolve => (id: string, date: string) => resolve({ id, date })
);

export const createMoveTodoAction = createAction(
    '@todoes/move',
    resolve => (
        fromDate: string,
        toDate: string,
        fromIndex: number,
        toIndex: number
    ) =>
        resolve({
            from: { date: fromDate, index: fromIndex },
            to: { date: toDate, index: toIndex },
        })
);
