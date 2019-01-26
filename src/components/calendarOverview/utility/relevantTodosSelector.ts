import { TodosReducerState } from '../../../storage/reducers/todosReducer';
import { Todo } from '../../../model/todo';
import { formatDate } from '../../../utility/dateTimeHelper';
import { DatesReducerState } from '../../../storage/reducers/datesReducer';

export type TodosForCalendarOverviewType = {
    [date: string]: Todo[];
};

export function applyOnlyRelevantTodosSelector(
    dates: DatesReducerState,
    todos: TodosReducerState,
    visibleDateRange: Date[]
): TodosForCalendarOverviewType {
    const todosForComponent: TodosForCalendarOverviewType = {};

    visibleDateRange.forEach(date => {
        todosForComponent[formatDate(date)] = [];
    });

    Object.keys(todosForComponent).forEach(key => {
        const todoIdsForDate =
            typeof dates[key] !== 'undefined' ? dates[key] : [];

        todosForComponent[key] = todos.filter(cursorTodo =>
            todoIdsForDate.includes(cursorTodo.id)
        );
    });

    return todosForComponent;
}
