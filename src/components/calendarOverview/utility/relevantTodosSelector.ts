import { TodosReducerState } from '../../../storage/reducers/todosReducer';
import { TodoCollection, Todo } from '../../../model/todo';
import {
    formatDate,
    parseDate,
    checkDateIsInRange,
} from '../../../utility/dateTimeHelper';

export function applyOnlyRelevantTodosSelector(
    todosReducerState: TodosReducerState,
    visibleDateRange: Date[]
): TodoCollection {
    const allTodos = todosReducerState || {};
    const todosForComponent: { [date: string]: Todo[] } = {};

    visibleDateRange.forEach(date => {
        todosForComponent[formatDate(date)] = [];
    });

    Object.keys(allTodos).forEach(key => {
        const cursorDate = parseDate(key);

        if (checkDateIsInRange(visibleDateRange, cursorDate)) {
            todosForComponent[key] = allTodos[key];
        }
    });

    return todosForComponent as TodoCollection;
}
