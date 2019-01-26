import { ActionType, getType } from 'typesafe-actions';
import * as actionFactories from './../actions/factory/datesActionFactories';
import { TodoIdCollection } from './../../model/todo';
import {
    formatTodayAsDate,
    parseDate,
    checkDateIsInThePast,
    createDateRelativeToSupplied,
    formatDate,
} from '../../utility/dateTimeHelper';
import produce from 'immer';
import {
    determineNextIndex,
    determinePrevousIndex,
} from '../../utility/arrayIndexNavigationHelper';

export type DatesAction = ActionType<typeof actionFactories>;

export type DatesReducerState = Readonly<{
    [date: string]: TodoIdCollection;
}>;

export const DEFAULT_STATE: DatesReducerState = {};

export default (
    currentState: DatesReducerState = DEFAULT_STATE,
    action: DatesAction
) => {
    switch (action.type) {
        case getType(actionFactories.createAddTodoToDateAction): {
            const { date, todoId } = action.payload;

            return produce<DatesReducerState>(currentState, draft => {
                if (typeof draft[date] === 'undefined') {
                    draft[date] = [];
                }

                draft[date].push(todoId);
            });
        }

        case getType(actionFactories.createMoveTodosInThePastToTodayAction): {
            return produce<DatesReducerState>(currentState, draft => {
                const dateTodayAsString = formatTodayAsDate();

                if (typeof draft[dateTodayAsString] === 'undefined') {
                    draft[dateTodayAsString] = [];
                }

                Object.keys(draft).forEach(dateAsString => {
                    const date = parseDate(dateAsString);

                    if (!checkDateIsInThePast(date)) {
                        // don't move the todos that are in the present and are still relevant

                        return;
                    }

                    draft[dateAsString].forEach(todoId =>
                        draft[dateTodayAsString].push(todoId)
                    );

                    // make sure nothing remains
                    delete draft[dateAsString];
                });
            });
        }

        case getType(actionFactories.createRemoveTodoFromDatesAction): {
            const { todoId } = action.payload;

            return produce<DatesReducerState>(currentState, draft => {
                Object.keys(draft).forEach(date => {
                    const todoIds = draft[date];

                    if (todoIds.includes(todoId)) {
                        draft[date] = todoIds.filter(
                            cursorTodoId => cursorTodoId !== todoId
                        );
                    }
                });
            });
        }

        case getType(actionFactories.createMoveTodoWithinDatesAction): {
            const { from, to } = action.payload;

            return produce<DatesReducerState>(currentState, draft => {
                // extract todo from old location
                if (typeof draft[from.date] === 'undefined') {
                    throw new Error(
                        'Expecting the date that the todo was moved from, to be available'
                    );
                }

                const [todoId] = draft[from.date].splice(from.index, 1);

                // move todo to new location
                if (typeof draft[to.date] === 'undefined') {
                    // new dates does not exist, create it..

                    draft[to.date] = [];
                }

                draft[to.date].splice(to.index, 0, todoId);
            });
        }

        case getType(actionFactories.createMoveTodoToNextDateAction): {
            const { todoId } = action.payload;

            return produce<DatesReducerState>(currentState, draft => {
                const currentDateAsString = Object.keys(draft).find(
                    dateAsString => draft[dateAsString].includes(todoId)
                );

                if (!currentDateAsString) {
                    return;
                }

                const currentDate = parseDate(currentDateAsString);
                const nextDate = createDateRelativeToSupplied(currentDate, 1);
                const nextDateAsString = formatDate(nextDate);

                const currentIndex = draft[currentDateAsString].findIndex(
                    cursorTodoId => cursorTodoId === todoId
                );

                // extract todo from old location
                draft[currentDateAsString].splice(currentIndex, 1);

                // move todo to new location
                if (typeof draft[nextDateAsString] === 'undefined') {
                    // new location does not exist, create it..

                    draft[nextDateAsString] = [];
                }

                draft[nextDateAsString].splice(0, 0, todoId);
            });
        }

        case getType(actionFactories.createMoveTodoToPreviousDateAction): {
            const { todoId } = action.payload;

            return produce<DatesReducerState>(currentState, draft => {
                const currentDateAsString = Object.keys(draft).find(
                    dateAsString => draft[dateAsString].includes(todoId)
                );

                if (!currentDateAsString) {
                    return;
                }

                const currentDate = parseDate(currentDateAsString);
                const previousDate = createDateRelativeToSupplied(
                    currentDate,
                    -1
                );

                if (checkDateIsInThePast(previousDate)) {
                    // don't allow moving to the past

                    return;
                }

                const previousDateAsString = formatDate(previousDate);

                const currentIndex = draft[currentDateAsString].findIndex(
                    cursorTodoId => cursorTodoId === todoId
                );

                // extract todo from old location
                draft[currentDateAsString].splice(currentIndex, 1);

                // move todo to new location
                if (typeof draft[previousDateAsString] === 'undefined') {
                    // new location does not exist, create it..

                    draft[previousDateAsString] = [];
                }

                draft[previousDateAsString].splice(0, 0, todoId);
            });
        }

        case getType(actionFactories.createMoveTodoToNextSpotAction): {
            const { todoId } = action.payload;

            return produce<DatesReducerState>(currentState, draft => {
                for (const dateAsString in draft) {
                    if (!draft.hasOwnProperty(dateAsString)) {
                        continue;
                    }

                    const currentIndex = draft[dateAsString].findIndex(
                        cursorTodoId => cursorTodoId === todoId
                    );

                    if (currentIndex === -1) {
                        continue;
                    }

                    const nextIndex = determineNextIndex(
                        currentIndex,
                        draft[dateAsString].length
                    );

                    // remove from old index
                    draft[dateAsString].splice(currentIndex, 1);

                    // move to new index
                    draft[dateAsString].splice(nextIndex, 0, todoId);

                    break;
                }
            });
        }

        case getType(actionFactories.createMoveTodoToPreviousSpotAction): {
            const { todoId } = action.payload;

            return produce<DatesReducerState>(currentState, draft => {
                for (const dateAsString in draft) {
                    if (!draft.hasOwnProperty(dateAsString)) {
                        continue;
                    }

                    const currentIndex = draft[dateAsString].findIndex(
                        cursorTodoId => cursorTodoId === todoId
                    );

                    if (currentIndex === -1) {
                        continue;
                    }

                    const nextIndex = determinePrevousIndex(
                        currentIndex,
                        draft[dateAsString].length
                    );

                    // remove from old index
                    draft[dateAsString].splice(currentIndex, 1);

                    // move to new index
                    draft[dateAsString].splice(nextIndex, 0, todoId);

                    break;
                }
            });
        }

        default:
            return currentState;
    }
};
