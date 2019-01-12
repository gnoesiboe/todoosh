import { TodoAction } from './../reducers/todosReducer';
import { CurrentTodoIndexAction } from '../reducers/currentTodoIndexReducer';
import { ProjectAction } from '../reducers/projectsReducer';
import { CurrentProjectIndexAction } from '../reducers/currentProjectIndexReducer';

export type RootAction =
    | TodoAction
    | CurrentTodoIndexAction
    | ProjectAction
    | CurrentProjectIndexAction;
