import { createAction } from 'typesafe-actions';
import { Project } from './../../../model/project';
import uuid from 'uuid/v4';

export const createAddTodoToProjectAction = createAction(
    '@projects/add-todo',
    resolve => (id: string, todoId: string) => resolve({ id, todoId })
);

export const createRemoveTodoFromProjectsAction = createAction(
    '@projects/remove-todo',
    resolve => (todoId: string) => resolve({ todoId })
);

export const createAddProjectAction = createAction(
    '@projects/create',
    resolve => (title: string, abbrevation: string) =>
        resolve({
            project: {
                id: uuid(),
                title,
                abbrevation,
                todos: [],
            } as Project,
        })
);
