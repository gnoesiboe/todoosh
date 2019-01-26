import { createAction } from 'typesafe-actions';
import { TodoSection } from '../../../model/TodoSection';

export const createSetCurrentTodoAction = createAction(
    '@current-todo/set',
    resolve => (id: string, section: TodoSection) => resolve({ id, section })
);

export const createClearCurrentTodoAction = createAction(
    '@current-todo/clear',
    resolve => (section: TodoSection) => resolve({ section })
);
