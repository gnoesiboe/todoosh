import * as actionFactories from './../actions/factory/currentProjectIndexActionFactories';
import { ActionType, getType } from 'typesafe-actions';

export type CurrentProjectIndexReducerState = number | null;

const DEFAULT_STATE: CurrentProjectIndexReducerState = null;

export type CurrentProjectIndexAction = ActionType<typeof actionFactories>;

export default (
    currentState: CurrentProjectIndexReducerState = DEFAULT_STATE,
    action: CurrentProjectIndexAction
) => {
    switch (action.type) {
        case getType(actionFactories.createSetCurrentProjectIndexAction):
            return action.payload.index;

        default:
            return currentState;
    }
};
