import { combineReducers } from 'redux';
import todosReducer, { TodosReducerState } from './todosReducer';
import currentTodoIndexReducer, {
    CurrentTodoIndexReducerState,
} from './currentTodoIndexReducer';

export type GlobalState = {
    todos?: TodosReducerState;
    currentTodoIndex?: CurrentTodoIndexReducerState;
};

export default combineReducers({
    todos: todosReducer,
    currentTodoIndex: currentTodoIndexReducer,
});
