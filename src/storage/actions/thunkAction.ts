import { ThunkAction } from 'redux-thunk';
import { GlobalState } from '../reducers';
import { Action } from 'redux';

export type ThunkResult<Result> = ThunkAction<
    Result,
    GlobalState,
    undefined,
    Action
>;
