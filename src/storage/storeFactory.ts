import { createStore as createReduxStore, Store } from 'redux';
import reducers from './reducers';
import { createMiddlewareChain } from './middleware/factory/middlewareFactory';

export function createStore(initialState = {}): Store {
    const middlewareChain = createMiddlewareChain();

    return createReduxStore(reducers, initialState, middlewareChain);
}
