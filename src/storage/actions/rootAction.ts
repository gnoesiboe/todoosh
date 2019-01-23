import { TodoAction } from './../reducers/todosReducer';
import { ProjectAction } from '../reducers/projectsReducer';
import { DatesAction } from '../reducers/datesReducer';
import { CurrentProjectIndexAction } from '../reducers/currentProjectIndexReducer';
import { CurrentTodoAction } from '../reducers/currentTodoReducer';
import { ThunkResult } from './thunkAction';

export type Action = RootAction | ThunkResult<void>;

export type RootAction =
    | TodoAction
    | ProjectAction
    | DatesAction
    | CurrentProjectIndexAction
    | CurrentTodoAction;
