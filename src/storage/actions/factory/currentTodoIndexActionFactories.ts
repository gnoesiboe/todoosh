import { createAction } from 'typesafe-actions';

export const createSetCurrentTodoIndexAction = createAction(
    '@curren-todo-index/set-current',
    resolve => (index: number) => resolve({ index })
);
