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

    Object.keys(todosForComponent).forEach(dateAsString => {
        const todoIdsForDate =
            typeof dates[dateAsString] !== 'undefined'
                ? dates[dateAsString]
                : [];

        todosForComponent[dateAsString] = todoIdsForDate.map(todoId => {
            const todo = todos.find(cursorTodo => cursorTodo.id === todoId);

            if (!todo) {
                throw new Error(`Could not find todo with id: '${todoId}|'`);
            }

            return todo;
        });
    });

    return todosForComponent;
}
