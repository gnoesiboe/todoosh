import { ActionType, getType } from 'typesafe-actions';
import * as actionFactories from './../actions/factory/currentTodoActionFactories';
import produce from 'immer';
import { TodoSection } from '../../model/TodoSection';

export type CurrentTodoAction = ActionType<typeof actionFactories>;

export type CurrentTodoReducerState = {
    [TodoSection.date]: string | null;
    [TodoSection.project]: string | null;
};

const DEFAULT_STATE: CurrentTodoReducerState = {
    [TodoSection.date]: null,
    [TodoSection.project]: null,
};

export default (
    currentState: CurrentTodoReducerState = DEFAULT_STATE,
    action: CurrentTodoAction
): CurrentTodoReducerState => {
    switch (action.type) {
        case getType(actionFactories.setCurrentTodoAction): {
            return produce<CurrentTodoReducerState>(currentState, draft => {
                const { id, section } = action.payload;

                draft[section] = id;
            });
        }

        default:
            return currentState;
    }
};
