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

export const UNCATEGORIZED_INDEX = '__uncategorized';

export const DEFAULT_STATE: TodosReducerState = {
    [UNCATEGORIZED_INDEX]: [],
};

export default (
    currentState: TodosReducerState = DEFAULT_STATE,
    action: TodoAction
) => {
    switch (action.type) {
        case getType(actionFactories.createAddTodoAction): {
            // tslint:disable-next-line:no-shadowed-variable
            const { date, todo } = action.payload;

            return produce<TodoCollection>(currentState, draft => {
                const group = date || UNCATEGORIZED_INDEX;

                if (typeof draft[group] === 'undefined') {
                    draft[group] = [];
                }

                draft[group].push(todo);
            });
        }

        case getType(actionFactories.createToggleTodoCompletedAction): {
            const { date, completed, id } = action.payload;

            return produce<TodoCollection>(currentState, draft => {
                const group = date || UNCATEGORIZED_INDEX;

                if (typeof draft[group] === 'undefined') {
                    throw new Error(
                        `Expecting the index '${group}' to be available`
                    );
                }

                const completedTodo = draft[group].find(
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
            const { date, title, id, deadline, projectId } = action.payload;

            return produce<TodoCollection>(currentState, draft => {
                const group = date || UNCATEGORIZED_INDEX;

                if (typeof draft[group] === 'undefined') {
                    throw new Error(
                        `Expecting the index '${group}' to be available`
                    );
                }

                const todo = draft[group].find(
                    cursorTodo => cursorTodo.id === id
                );

                if (!todo) {
                    throw new Error('Cannot find todo to edit');
                }

                todo.title = title;
                todo.deadline = deadline;
                todo.projectId = projectId;
            });
        }

        case getType(actionFactories.createDeleteTodoAction): {
            const { date, id } = action.payload;

            return produce<TodoCollection>(currentState, draft => {
                const group = date || UNCATEGORIZED_INDEX;

                if (typeof draft[group] === 'undefined') {
                    throw new Error(
                        `Expecting the index '${group}' to be available`
                    );
                }

                const todoIndex = draft[group].findIndex(
                    cursorTodo => cursorTodo.id === id
                );

                if (todoIndex === -1) {
                    throw new Error('Cannot find todo to delete');
                }

                draft[group].splice(todoIndex, 1);
            });
        }

        case getType(actionFactories.createMoveTodoAction): {
            const { from, to } = action.payload;

            return produce<TodoCollection>(currentState, draft => {
                // extract todo from old location
                if (typeof draft[from.date] === 'undefined') {
                    throw new Error('Expecting the date to be available');
                }

                const [todo] = draft[from.date].splice(from.index, 1);

                // move todo to new location
                if (typeof draft[to.date] === 'undefined') {
                    draft[to.date] = [];
                }

                draft[to.date].splice(to.index, 0, todo);
            });
        }

        case getType(
            actionFactories.createMoveUnfinishedTodosInThePastToTodayAndRemoveCompletedAction
        ): {
            return produce<TodoCollection>(currentState, draft => {
                const dateTodayAsString = formatTodayAsDate();

                if (!draft[dateTodayAsString]) {
                    draft[dateTodayAsString] = [];
                }

                Object.keys(draft).forEach(dateAsString => {
                    const date = parseDate(dateAsString);

                    if (!checkDateIsInThePast(date)) {
                        // don't move the todos in the present

                        return;
                    }

                    // first remove todos that are completed
                    draft[dateAsString] = draft[dateAsString].filter(
                        todo => !todo.isCompleted
                    );

                    // move not completed todos to today (prepend)
                    draft[dateAsString].forEach(todo => {
                        draft[dateTodayAsString].push(todo);
                    });

                    // make sure nothing remains
                    delete draft[dateAsString];
                });
            });
        }

        default:
            return currentState;
    }
};
