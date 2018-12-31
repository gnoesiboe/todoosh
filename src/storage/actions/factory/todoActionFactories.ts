import { createAction } from 'typesafe-actions';
import { Todo } from '../../../model/todo';
import uuid from 'uuid/v4';
import { formatDate } from '../../../utility/dateTImeHelper';

export const createAddTodoAction = createAction(
    '@todos/create',
    resolve => (title: string, date: Date, isChecked: boolean = false) =>
        resolve({
            todo: {
                id: uuid(),
                title,
                isChecked,
            } as Todo,
            date: formatDate(date) as string,
        })
);
