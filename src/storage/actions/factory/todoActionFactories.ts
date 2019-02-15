import { createAction } from 'typesafe-actions';
import { Todo } from '../../../model/todo';

export const createAddTodoAction = createAction(
    '@todos/create',
    resolve => (todo: Todo) => resolve({ todo })
);

export const createToggleTodoCompletedAction = createAction(
    '@todos/toggle-completed',
    resolve => (id: string) => resolve({ id })
);

export const createUpdateTodoAction = createAction(
    '@todos/update',
    resolve => (updatedTodo: Todo) => resolve({ newTodo: updatedTodo })
);

export const createDeleteTodoAction = createAction(
    '@todos/delete',
    resolve => (id: string) => resolve({ id })
);

export const createRemoveCompletedTodosAction = createAction(
    '@todos/remove-completed',
    resolve => () => resolve({})
);
