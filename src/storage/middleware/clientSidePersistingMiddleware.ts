import { Middleware, Dispatch } from 'redux';
import { RootAction } from '../actions/rootAction';
import { GlobalState } from '../reducers';
import store from 'store';

export const clientSidePersistingMiddleware: Middleware = ({ getState }) => (
    next: Dispatch
) => (action: RootAction) => {
    const result = next(action);

    const newState: GlobalState = getState();

    store.set('todos', newState.todos || {});

    return result;
};
