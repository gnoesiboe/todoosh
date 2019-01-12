import { createAction } from 'typesafe-actions';

export const createSetCurrentTodoIndexAction = createAction(
    '@current-todo-index/set',
    resolve => (index: number) => resolve({ index })
);
