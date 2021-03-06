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

export const createUpdateProjectAction = createAction(
    '@projects/update',
    resolve => (id: string, title: string, abbrevation: string) =>
        resolve({ id, title, abbrevation })
);

export const createMoveTodoToOtherProjectAction = createAction(
    '@projects/move-todo',
    resolve => (todoId: string, oldProjectId: string, newProjectId: string) =>
        resolve({ todoId, oldProjectId, newProjectId })
);

export const createDeleteProjectAction = createAction(
    '@projects/delete',
    resolve => (id: string) => resolve({ id })
);

export const createMoveTodoWithinProjectsAction = createAction(
    '@projects/move-project',
    resolve => (
        fromId: string,
        toId: string,
        fromIndex: number,
        toIndex: number
    ) =>
        resolve({
            from: { projectId: fromId, index: fromIndex },
            to: { projectId: toId, index: toIndex },
        })
);
