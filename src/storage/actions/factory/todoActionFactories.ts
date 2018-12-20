import { createAction } from 'typesafe-actions';
import { Todo } from '../../../model/todo';
import uuid from 'uuid/v4';

export const createAddTodoAction = createAction(
    '@todos/create',
    resolve => (title: string, date: string, isChecked: boolean = false) =>
        resolve({
            id: uuid(),
            title,
            isChecked,
            date,
        } as Todo)
);
