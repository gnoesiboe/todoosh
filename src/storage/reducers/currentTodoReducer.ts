import { ActionType, getType } from 'typesafe-actions';
import * as actionFactories from './../actions/factory/currentTodoActionFactories';
import produce from 'immer';

export type CurrentTodoAction = ActionType<typeof actionFactories>;

export enum CurrentTodoSection {
    date,
    project,
}

export type CurrentTodoReducerState = {
    [CurrentTodoSection.date]: string | null;
    [CurrentTodoSection.project]: string | null;
};

const DEFAULT_STATE: CurrentTodoReducerState = {
    [CurrentTodoSection.date]: null,
    [CurrentTodoSection.project]: null,
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
