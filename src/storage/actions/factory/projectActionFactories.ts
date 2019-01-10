import { createAction } from 'typesafe-actions';
import { Project } from './../../../model/project';
import uuid from 'uuid/v4';

export const createProjectAction = createAction(
    '@projects/create',
    resolve => (title: string, abbrevation: string) =>
        resolve({
            project: {
                id: uuid(),
                title,
                abbrevation,
            } as Project,
        })
);
