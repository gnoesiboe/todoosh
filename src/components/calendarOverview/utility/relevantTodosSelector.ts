import { TodosReducerState } from '../../../storage/reducers/todosReducer';
import { TodoCollection, Todo } from '../../../model/todo';
import {
    formatDate,
    parseDate,
    checkDateIsInRange,
} from '../../../utility/dateTimeHelper';
import { TodoSection } from '../../../model/TodoSection';

export function applyOnlyRelevantTodosSelector(
    todosReducerState: TodosReducerState,
    visibleDateRange: Date[]
): TodoCollection {
    const allDateTodos = todosReducerState
        ? todosReducerState[TodoSection.date]
        : {};

    const todosForComponent: { [date: string]: Todo[] } = {};

    visibleDateRange.forEach(date => {
        todosForComponent[formatDate(date)] = [];
    });

    Object.keys(allDateTodos).forEach(key => {
        const cursorDate = parseDate(key);

        if (checkDateIsInRange(visibleDateRange, cursorDate)) {
            todosForComponent[key] = allDateTodos[key];
        }
    });

    return todosForComponent as TodoCollection;
}
