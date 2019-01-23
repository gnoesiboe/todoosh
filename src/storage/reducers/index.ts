import { combineReducers } from 'redux';
import todosReducer, { TodosReducerState } from './todosReducer';
import projectsReducer, { ProjectsReducerState } from './projectsReducer';
import currentProjectIndexReducer, {
    CurrentProjectIndexReducerState,
} from './currentProjectIndexReducer';
import currentTodoReducer, {
    CurrentTodoReducerState,
} from './currentTodoReducer';
import datesReducer, { DatesReducerState } from './datesReducer';

export type GlobalState = {
    todos?: TodosReducerState;
    projects?: ProjectsReducerState;
    dates?: DatesReducerState;
    currentProjectIndex?: CurrentProjectIndexReducerState;
    currentTodo?: CurrentTodoReducerState;
};

export default combineReducers({
    todos: todosReducer,
    projects: projectsReducer,
    dates: datesReducer,
    currentProjectIndex: currentProjectIndexReducer,
    currentTodo: currentTodoReducer,
});
