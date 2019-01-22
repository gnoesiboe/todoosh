import { TodoAction } from './../reducers/todosReducer';
import { CurrentTodoIndexAction } from '../reducers/currentTodoIndexReducer';
import { ProjectAction } from '../reducers/projectsReducer';
import { CurrentProjectIndexAction } from '../reducers/currentProjectIndexReducer';
import { CurrentTodoAction } from '../reducers/currentTodoReducer';

export type RootAction =
    | TodoAction
    | CurrentTodoIndexAction
    | ProjectAction
    | CurrentProjectIndexAction
    | CurrentTodoAction;
