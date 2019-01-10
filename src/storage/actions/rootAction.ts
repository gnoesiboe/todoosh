import { TodoAction } from './../reducers/todosReducer';
import { CurrentTodoIndexAction } from '../reducers/currentTodoIndexReducer';
import { ProjectAction } from '../reducers/projectsReducer';

export type RootAction = TodoAction | CurrentTodoIndexAction | ProjectAction;
