import { combineReducers } from 'redux';
import todosReducer, { TodosReducerState } from './todosReducer';
import currentTodoIndexReducer, {
    CurrentTodoIndexReducerState,
} from './currentTodoIndexReducer';
import projectsReducer, { ProjectsReducerState } from './projectsReducer';

export type GlobalState = {
    todos?: TodosReducerState;
    currentTodoIndex?: CurrentTodoIndexReducerState;
    projects?: ProjectsReducerState;
};

export default combineReducers({
    todos: todosReducer,
    projects: projectsReducer,
    currentTodoIndex: currentTodoIndexReducer,
});
