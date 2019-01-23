import { ActionType, getType } from 'typesafe-actions';
import * as actionFactories from './../actions/factory/todoActionFactories';
import { TodoCollection } from '../../model/todo';
import produce from 'immer';
import {
    parseDate,
    checkDateIsInThePast,
    formatTodayAsDate,
} from '../../utility/dateTimeHelper';

export type TodoAction = ActionType<typeof actionFactories>;

export type TodosReducerState = TodoCollection;

export const DEFAULT_STATE: TodosReducerState = [];

export default (
    currentState: TodosReducerState = DEFAULT_STATE,
    action: TodoAction
) => {
    switch (action.type) {
        case getType(actionFactories.createAddTodoAction): {
            // tslint:disable-next-line:no-shadowed-variable
            const { todo } = action.payload;

            return produce<TodosReducerState>(currentState, draft => {
                draft.push(todo);
            });
        }

        case getType(actionFactories.createToggleTodoCompletedAction): {
            const { id } = action.payload;

            return produce<TodosReducerState>(currentState, draft => {
                const todo = draft.find(cursorTodo => cursorTodo.id === id);

                if (!todo) {
                    return currentState;
                }

                todo.completedAt = todo.completedAt
                    ? null
                    : formatTodayAsDate();
            });
        }

        case getType(actionFactories.createUpdateTodoAction): {
            const { newTodo } = action.payload;

            return produce<TodosReducerState>(currentState, draft => {
                const index = draft.findIndex(
                    cursorTodo => cursorTodo.id === newTodo.id
                );

                if (index === -1) {
                    return;
                }

                draft[index] = newTodo;
            });
        }

        case getType(actionFactories.createDeleteTodoAction): {
            const { id } = action.payload;

            return produce<TodosReducerState>(currentState, draft => {
                draft = draft.filter(cursorTodo => cursorTodo.id !== id);
            });
        }

        case getType(actionFactories.createRemoveCompletedTodosAction): {
            return produce<TodosReducerState>(currentState, draft => {
                draft = draft.filter(todo => {
                    if (!todo.completedAt) {
                        return true;
                    }

                    const completedAt = parseDate(todo.completedAt);

                    return !checkDateIsInThePast(completedAt);
                });
            });
        }

        default:
            return currentState;
    }
};
