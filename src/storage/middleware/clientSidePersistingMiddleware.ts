import { Middleware, Dispatch } from 'redux';
import { RootAction } from '../actions/rootAction';
import { GlobalState } from '../reducers';
import store from 'store';
import { DEFAULT_STATE as DEFAULT_TODOS_REDUCER_STATE } from '../reducers/todosReducer';
import { DEFAULT_STATE as DEFAULT_PROJECTS_REDUCER_STATE } from '../reducers/projectsReducer';
import { DEFAULT_STATE as DEFAULT_DATES_REDUCER_STATE } from '../reducers/datesReducer';

export const clientSidePersistingMiddleware: Middleware = ({ getState }) => (
    next: Dispatch
) => (action: RootAction) => {
    const result = next(action);
    const newState: GlobalState = getState();

    store.set('todos', newState.todos || DEFAULT_TODOS_REDUCER_STATE);
    store.set('projects', newState.projects || DEFAULT_PROJECTS_REDUCER_STATE);
    store.set('dates', newState.dates || DEFAULT_DATES_REDUCER_STATE);

    return result;
};
