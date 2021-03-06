import thunkMiddleware from 'redux-thunk';
import { applyMiddleware, StoreEnhancer, compose } from 'redux';
import { clientSidePersistingMiddleware } from '../clientSidePersistingMiddleware';

export function createMiddlewareChain(): StoreEnhancer {
    const middlewares = [clientSidePersistingMiddleware, thunkMiddleware];

    // @ts-ignore
    const devtoolsCompose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
    const enhancedComposer =
        typeof devtoolsCompose !== 'undefined' ? devtoolsCompose : compose;

    return enhancedComposer(applyMiddleware(...middlewares));
}
