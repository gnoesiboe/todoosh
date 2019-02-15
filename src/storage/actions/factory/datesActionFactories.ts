import { createAction } from 'typesafe-actions';
import { formatDate } from './../../../utility/dateTimeHelper';

export const createAddTodoToDateAction = createAction(
    '@dates/add-todo',
    resolve => (date: Date, todoId: string) =>
        resolve({
            date: formatDate(date),
            todoId,
        })
);

export const createRemoveTodoFromDatesAction = createAction(
    '@dates/remove-todo',
    resolve => (todoId: string) => resolve({ todoId })
);

export const createMoveTodosInThePastToTodayAction = createAction(
    '@dates/move-todos-in-the-past-to-today',
    resolve => () => resolve()
);

export const createMoveTodoWithinDatesAction = createAction(
    '@dates/move-todo',
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

export const createMoveTodoToNextSpotAction = createAction(
    '@dates/move-todo-to-next-spot',
    resolve => (todoId: string) => resolve({ todoId })
);

export const createMoveTodoToPreviousSpotAction = createAction(
    '@dates/move-todo-to-previous-spot',
    resolve => (todoId: string) => resolve({ todoId })
);

export const createMoveTodoToNextDateAction = createAction(
    '@dates/move-todo-to-next-date',
    resolve => (todoId: string) => resolve({ todoId })
);

export const createMoveTodoToPreviousDateAction = createAction(
    '@dates/move-todo-to-previous-date',
    resolve => (todoId: string) => resolve({ todoId })
);

export const createPlanTodoAction = createAction(
    '@dates/plan-todo',
    resolve => (id: string, newDate: string) =>
        resolve({
            id,
            newDate,
        })
);
