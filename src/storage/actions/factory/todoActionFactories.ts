import { createAction } from 'typesafe-actions';
import { Todo } from '../../../model/todo';
import uuid from 'uuid/v4';
import { formatDate } from '../../../utility/dateTimeHelper';

export const createAddTodoAction = createAction(
    '@todos/create',
    resolve => (
        title: string,
        projectId: string,
        date: Date | null = null,
        deadline: string | null = null,
        isCompleted: boolean = false
    ) =>
        resolve({
            todo: {
                id: uuid(),
                projectId,
                title,
                isCompleted,
                deadline,
            } as Todo,
            date: date ? (formatDate(date) as string) : null,
        })
);

export const createToggleTodoCompletedAction = createAction(
    '@todos/toggle-completed',
    resolve => (
        id: string,
        date: string | null,
        completed: boolean,
        projectId: string
    ) => resolve({ id, date, completed, projectId })
);

export const createUpdateTodoAction = createAction(
    '@todos/update',
    resolve => (
        id: string,
        projectId: string,
        date: string | null,
        title: string,
        deadline: string | null = null
    ) => resolve({ id, title, date, projectId, deadline })
);

export const createDeleteTodoAction = createAction(
    '@todos/delete',
    resolve => (id: string, projectId: string, date: string | null = null) =>
        resolve({ id, date, projectId })
);

export const createMoveTodoAction = createAction(
    '@todos/move',
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

export const createMoveUnfinishedTodosInThePastToTodayAndRemoveCompletedAction = createAction(
    '@todos/move-unfinished-in-the-past-to-today-and-remove-completed',
    resolve => () => resolve()
);
