import { ActionType, getType } from 'typesafe-actions';
import * as actionFactories from './../actions/factory/currentDateActionFactories';

export type CurrentDateReducerState = string | null;
export type CurrentDateAction = ActionType<typeof actionFactories>;

const defaultState: CurrentDateReducerState = null;

export default (
    currentState: CurrentDateReducerState = defaultState,
    action: CurrentDateAction
) => {
    switch (action.type) {
        case getType(actionFactories.createSetCurrentDateAction):
            return action.payload.date;

        default:
            return currentState;
    }
};
