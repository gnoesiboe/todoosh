import { ThunkResult } from './../thunkAction';
import { createAction } from 'typesafe-actions';
import { CurrentTodoSection } from '../../reducers/currentTodoReducer';

export const setCurrentTodoAction = createAction(
    '@current-todo/set',
    resolve => (id: string, section: CurrentTodoSection) =>
        resolve({ id, section })
);

export function createMoveToNextTodoAction(
    id: string,
    section: CurrentTodoSection
): ThunkResult<void> {
    return (dispatch, getState) => {
        const todos = getState().todos;
        const currentTodoId = getState().currentTodo;

        if (currentTodoId) {
            // locate this todo and find the next id
        } else {
            // locate the first todo
        }

        if (!todos) {
            throw new Error('Todos should be available at this point');
        }

        dispatch(setCurrentTodoAction(id, section));
    };
}
