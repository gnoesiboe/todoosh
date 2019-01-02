import { ActionType, getType } from 'typesafe-actions';
import * as actionFactories from './../actions/factory/todoActionFactories';
import { TodoCollection } from '../../model/todo';
import produce from 'immer';

export type TodoAction = ActionType<typeof actionFactories>;

export type TodosReducerState = TodoCollection | null;

const DEFAULT_STATE: TodosReducerState = null;

export default (
    currentState: TodosReducerState = DEFAULT_STATE,
    action: TodoAction
) => {
    switch (action.type) {
        case getType(actionFactories.createAddTodoAction): {
            // tslint:disable-next-line:no-shadowed-variable
            const { date, todo } = action.payload;

            if (!currentState) {
                return { [action.payload.date]: [todo] };
            }

            return produce<TodoCollection>(currentState, draft => {
                if (typeof draft[date] === 'undefined') {
                    draft[date] = [];
                }

                draft[date].push(todo);
            });
        }

        case getType(actionFactories.createToggleTodoCompletedAction): {
            if (!currentState) {
                throw new Error(
                    'No change should be possible when there is no initial state!'
                );
            }

            // tslint:disable-next-line:no-shadowed-variable
            const { date: todoDate, completed, id } = action.payload;

            return produce<TodoCollection>(currentState, draft => {
                if (typeof draft[todoDate] === 'undefined') {
                    throw new Error('Expecting the date to be available');
                }

                const completedTodo = draft[todoDate].find(
                    cursorTodo => cursorTodo.id === id
                );

                if (!completedTodo) {
                    throw new Error(
                        // tslint:disable-next-line:quotemark
                        "Cannot find todo who's completed status has changed"
                    );
                }

                completedTodo.isCompleted = completed;
            });
        }

        case getType(actionFactories.createUpdateTodoAction): {
            if (!currentState) {
                throw new Error(
                    'No change should be possible when there is no initial state!'
                );
            }

            const { date, title, id } = action.payload;

            return produce<TodoCollection>(currentState, draft => {
                if (typeof draft[date] === 'undefined') {
                    throw new Error('Expecting the date to be available');
                }

                const todo = draft[date].find(
                    cursorTodo => cursorTodo.id === id
                );

                if (!todo) {
                    throw new Error('Cannot find todo to edit');
                }

                todo.title = title;
            });
        }

        default:
            return currentState;
    }
};
