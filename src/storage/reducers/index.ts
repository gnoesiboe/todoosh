import { combineReducers } from 'redux';
import todosReducer, { TodosReducerState } from './todosReducer';
import currentTodoIndexReducer, {
    CurrentTodoIndexReducerState,
} from './currentTodoIndexReducer';
import projectsReducer, { ProjectsReducerState } from './projectsReducer';
import currentProjectIndexReducer, {
    CurrentProjectIndexReducerState,
} from './currentProjectIndexReducer';

export type GlobalState = {
    todos?: TodosReducerState;
    currentTodoIndex?: CurrentTodoIndexReducerState;
    projects?: ProjectsReducerState;
    currentProjectIndex?: CurrentProjectIndexReducerState;
};

export default combineReducers({
    todos: todosReducer,
    projects: projectsReducer,
    currentTodoIndex: currentTodoIndexReducer,
    currentProjectIndex: currentProjectIndexReducer,
});
