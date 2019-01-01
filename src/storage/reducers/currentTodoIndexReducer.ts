import { ActionType, getType } from 'typesafe-actions';
import * as actionFactories from './../actions/factory/currentTodoIndexActionFactories';

export type CurrentTodoIndexReducerState = number;

const DEFAULT_STATE: CurrentTodoIndexReducerState = 0;

export type CurrentTodoIndexAction = ActionType<typeof actionFactories>;

export default (
    currentState: CurrentTodoIndexReducerState = DEFAULT_STATE,
    action: CurrentTodoIndexAction
): CurrentTodoIndexReducerState => {
    switch (action.type) {
        case getType(actionFactories.createSetCurrentTodoIndexAction):
            return action.payload.index;

        default:
            return currentState;
    }
};
