import { createAction } from 'typesafe-actions';

export const createSetCurrentProjectIndexAction = createAction(
    '@current-project-index/set',
    resolve => (index: number) => resolve({ index })
);
