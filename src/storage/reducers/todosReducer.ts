import { ActionType, getType } from 'typesafe-actions';
import * as actionFactories from './../actions/factory/todoActionFactories';
import { TodoCollection } from '../../model/todo';
import produce from 'immer';
import {
    parseDate,
    checkDateIsInThePast,
    formatTodayAsDate,
} from '../../utility/dateTimeHelper';
import { TodoSection } from '../../model/TodoSection';

export type TodoAction = ActionType<typeof actionFactories>;

export type TodosReducerState = {
    [TodoSection.date]: TodoCollection;
    [TodoSection.project]: TodoCollection;
};

export const DEFAULT_STATE: TodosReducerState = {
    [TodoSection.date]: {},
    [TodoSection.project]: {},
};

export default (
    currentState: TodosReducerState = DEFAULT_STATE,
    action: TodoAction
) => {
    switch (action.type) {
        case getType(actionFactories.createAddTodoAction): {
            // tslint:disable-next-line:no-shadowed-variable
            const { date, todo } = action.payload;

            return produce<TodosReducerState>(currentState, draft => {
                const section = date ? TodoSection.date : TodoSection.project;
                const group =
                    section === TodoSection.date ? date : todo.projectId;

                if (!group) {
                    throw new Error(
                        'Expected group to be available at this point'
                    );
                }

                if (typeof draft[section][group] === 'undefined') {
                    draft[section][group] = [];
                }

                draft[section][group].push(todo);
            });
        }

        case getType(actionFactories.createToggleTodoCompletedAction): {
            const { date, completed, id, projectId } = action.payload;

            return produce<TodosReducerState>(currentState, draft => {
                const section = date ? TodoSection.date : TodoSection.project;
                const group = section === TodoSection.date ? date : projectId;

                if (!group) {
                    throw new Error(
                        'Expected group to be available at this point'
                    );
                }

                if (typeof draft[section][group] === 'undefined') {
                    throw new Error(
                        `Expecting the index '${group}' to be available`
                    );
                }

                const completedTodo = draft[section][group].find(
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

            return produce<TodosReducerState>(currentState, draft => {
                const section = date ? TodoSection.date : TodoSection.project;
                const group = section === TodoSection.date ? date : projectId;

                if (!group) {
                    throw new Error(
                        'Expected group to be available at this point'
                    );
                }

                if (typeof draft[section][group] === 'undefined') {
                    throw new Error(
                        `Expecting the index '${group}' to be available`
                    );
                }

                const todo = draft[section][group].find(
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
            const { date, id, projectId } = action.payload;

            return produce<TodosReducerState>(currentState, draft => {
                const section = date ? TodoSection.date : TodoSection.project;
                const group = section === TodoSection.date ? date : projectId;

                if (!group) {
                    throw new Error(
                        'Expected group to be available at this point'
                    );
                }

                if (typeof draft[section][group] === 'undefined') {
                    throw new Error(
                        `Expecting the index '${group}' to be available`
                    );
                }

                const todoIndex = draft[section][group].findIndex(
                    cursorTodo => cursorTodo.id === id
                );

                if (todoIndex === -1) {
                    throw new Error('Cannot find todo to delete');
                }

                draft[section][group].splice(todoIndex, 1);
            });
        }

        case getType(actionFactories.createMoveTodoAction): {
            const { from, to } = action.payload;

            return produce<TodosReducerState>(currentState, draft => {
                // extract todo from old location
                if (typeof draft[TodoSection.date][from.date] === 'undefined') {
                    throw new Error('Expecting the date to be available');
                }

                const [todo] = draft[TodoSection.date][from.date].splice(
                    from.index,
                    1
                );

                // move todo to new location
                if (typeof draft[TodoSection.date][to.date] === 'undefined') {
                    draft[TodoSection.date][to.date] = [];
                }

                draft[TodoSection.date][to.date].splice(to.index, 0, todo);
            });
        }

        case getType(
            actionFactories.createMoveUnfinishedTodosInThePastToTodayAndRemoveCompletedAction
        ): {
            return produce<TodosReducerState>(currentState, draft => {
                const dateTodayAsString = formatTodayAsDate();

                if (!draft[TodoSection.date][dateTodayAsString]) {
                    draft[TodoSection.date][dateTodayAsString] = [];
                }

                Object.keys(draft[TodoSection.date]).forEach(dateAsString => {
                    const date = parseDate(dateAsString);

                    if (!checkDateIsInThePast(date)) {
                        // don't move the todos in the present

                        return;
                    }

                    // first remove todos that are completed
                    draft[TodoSection.date][dateAsString] = draft[
                        TodoSection.date
                    ][dateAsString].filter(todo => !todo.isCompleted);

                    // move not completed todos to today (prepend)
                    draft[TodoSection.date][dateAsString].forEach(todo => {
                        draft[TodoSection.date][dateTodayAsString].push(todo);
                    });

                    // make sure nothing remains
                    delete draft[TodoSection.date][dateAsString];
                });
            });
        }

        default:
            return currentState;
    }
};
