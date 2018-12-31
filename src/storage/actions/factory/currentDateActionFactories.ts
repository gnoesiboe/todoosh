import { createAction } from 'typesafe-actions';

export const createSetCurrentDateAction = createAction(
    '@date/set-current',
    resolve => (date: string) => resolve({ date })
);
