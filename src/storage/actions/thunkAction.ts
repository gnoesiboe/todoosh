import { ThunkAction } from 'redux-thunk';
import { GlobalState } from '../reducers';
import { RootAction } from './rootAction';

export type ThunkResult<Result> = ThunkAction<
    Result,
    GlobalState,
    undefined,
    RootAction
>;
