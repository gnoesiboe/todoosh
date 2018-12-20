import thunkMiddleware from 'redux-thunk';
import { applyMiddleware, StoreEnhancer } from 'redux';

export function createMiddlewareChain(): StoreEnhancer {
    const middlewares = [thunkMiddleware];

    return applyMiddleware(...middlewares);
}
