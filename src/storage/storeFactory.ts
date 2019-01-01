import { createStore as createReduxStore, Store } from 'redux';
import reducers from './reducers';
import { createMiddlewareChain } from './middleware/factory/middlewareFactory';
import store from 'store';

export function createStore(): Store {
    const middlewareChain = createMiddlewareChain();

    const initialState = {
        todos: store.get('todos', {}),
    };

    return createReduxStore(reducers, initialState, middlewareChain);
}
