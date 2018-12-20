import { combineReducers } from 'redux';
import todosReducer, { TodosReducerState } from './todosReducer';

export type GlobalState = {
    todos?: TodosReducerState;
};

export default combineReducers({
    todos: todosReducer,
});
