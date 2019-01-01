import { TodoAction } from './../reducers/todosReducer';
import { CurrentDateAction } from './../reducers/currentDateReducer';
import { CurrentTodoIndexAction } from '../reducers/currentTodoIndexReducer';

export type RootAction =
    | CurrentDateAction
    | TodoAction
    | CurrentTodoIndexAction;
