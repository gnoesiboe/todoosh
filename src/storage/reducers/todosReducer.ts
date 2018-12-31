import { ActionType, getType } from 'typesafe-actions';
import * as actionFactories from './../actions/factory/todoActionFactories';
import { TodoCollection } from '../../model/todo';

export type TodoAction = ActionType<typeof actionFactories>;

export type TodosReducerState = TodoCollection | null;

const defaultState: TodosReducerState = null;

function handleCreateAddTodoAction(
    currentState: TodosReducerState,
    action: TodoAction
): TodosReducerState {
    const { date, todo } = action.payload;

    if (!currentState) {
        return {
            [action.payload.date]: [todo],
        };
    }

    return {
        ...currentState,
        [date]: [...(currentState[date] || {}), todo],
    };
}

export default (
    currentState: TodosReducerState = defaultState,
    action: TodoAction
) => {
    switch (action.type) {
        case getType(actionFactories.createAddTodoAction):
            return handleCreateAddTodoAction(currentState, action);

        default:
            return currentState;
    }
};
