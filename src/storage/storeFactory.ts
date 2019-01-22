import { createStore as createReduxStore, Store } from 'redux';
import reducers, { GlobalState } from './reducers';
import { createMiddlewareChain } from './middleware/factory/middlewareFactory';
import store from 'store';
import { DEFAULT_STATE as DEFAULT_TODOS_REDUCER_STATE } from './reducers/todosReducer';
import { DEFAULT_STATE as DEFAULT_PROJECTS_REDUCER_STATE } from './reducers/projectsReducer';

export function createStore(): Store {
    const middlewareChain = createMiddlewareChain();

    const initialState: GlobalState = {
        todos: store.get('todos', DEFAULT_TODOS_REDUCER_STATE),
        projects: store.get('projects', DEFAULT_PROJECTS_REDUCER_STATE),
    };

    return createReduxStore(reducers, initialState, middlewareChain);
}
