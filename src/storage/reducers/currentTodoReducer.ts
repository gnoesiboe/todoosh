import { ActionType, getType } from 'typesafe-actions';
import * as actionFactories from './../actions/factory/currentTodoActionFactories';
import produce from 'immer';
import { TodoSection } from '../../model/TodoSection';

export type CurrentTodoAction = ActionType<typeof actionFactories>;

export type CurrentTodoReducerState = {
    [TodoSection.date]: string | null;
    [TodoSection.project]: string | null;
};

export const DEFAULT_STATE: CurrentTodoReducerState = {
    [TodoSection.date]: null,
    [TodoSection.project]: null,
};

export default (
    currentState: CurrentTodoReducerState = DEFAULT_STATE,
    action: CurrentTodoAction
): CurrentTodoReducerState => {
    switch (action.type) {
        case getType(actionFactories.createSetCurrentTodoAction): {
            const { id, section } = action.payload;

            return produce<CurrentTodoReducerState>(currentState, draft => {
                draft[section] = id;
            });
        }

        case getType(actionFactories.createClearCurrentTodoAction): {
            const { section } = action.payload;

            return produce<CurrentTodoReducerState>(currentState, draft => {
                draft[section] = null;
            });
        }

        default:
            return currentState;
    }
};
