import { createStore as createReduxStore, Store } from 'redux';
import reducers, { GlobalState } from './reducers';
import { createMiddlewareChain } from './middleware/factory/middlewareFactory';
import store from 'store';

export function createStore(): Store {
    const middlewareChain = createMiddlewareChain();

    const initialState: GlobalState = {
        todos: store.get('todos', {}),
        projects: store.get('projects', []),
    };

    return createReduxStore(reducers, initialState, middlewareChain);
}
