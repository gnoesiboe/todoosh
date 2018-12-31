import { combineReducers } from 'redux';
import todosReducer, { TodosReducerState } from './todosReducer';
import currentDateReducer, {
    CurrentDateReducerState,
} from './currentDateReducer';

export type GlobalState = {
    todos?: TodosReducerState;
    currentDate?: CurrentDateReducerState;
};

export default combineReducers({
    todos: todosReducer,
    currentDate: currentDateReducer,
});
