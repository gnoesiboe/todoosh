import { ActionType, getType } from 'typesafe-actions';
import * as actionFactories from './../actions/factory/todoActionFactories';
import { TodoCollection } from '../../model/todo';

export type TodoActionSignatures = ActionType<typeof actionFactories>;

export type TodosReducerState = TodoCollection | null;

const defaultState: TodosReducerState = null;

export default (
    currentState: TodosReducerState = defaultState,
    action: TodoActionSignatures
) => {
    switch (action.type) {
        case getType(actionFactories.createAddTodoAction):
            return Array.isArray(currentState)
                ? [...currentState, action.payload]
                : [action.payload];

        default:
            return currentState;
    }
};
