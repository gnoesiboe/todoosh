import { TodoAction } from './../reducers/todosReducer';
import { CurrentTodoIndexAction } from '../reducers/currentTodoIndexReducer';

export type RootAction = TodoAction | CurrentTodoIndexAction;
