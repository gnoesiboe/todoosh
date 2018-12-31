import { TodoAction } from './../reducers/todosReducer';
import { CurrentDateAction } from './../reducers/currentDateReducer';

export type RootAction = CurrentDateAction | TodoAction;
