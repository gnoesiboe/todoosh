import { combineReducers } from 'redux';
import todosReducer, { TodosReducerState } from './todosReducer';
import currentDateReducer, {
    CurrentDateReducerState,
} from './currentDateReducer';
import currentTodoIndexReducer, {
    CurrentTodoIndexReducerState,
} from './currentTodoIndexReducer';

export type GlobalState = {
    todos?: TodosReducerState;
    currentDate?: CurrentDateReducerState;
    currentTodoIndex?: CurrentTodoIndexReducerState;
};

export default combineReducers({
    todos: todosReducer,
    currentDate: currentDateReducer,
    currentTodoIndex: currentTodoIndexReducer,
});
