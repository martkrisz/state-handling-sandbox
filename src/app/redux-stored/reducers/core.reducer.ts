import { combineReducers } from 'redux';
import { AuthReducer } from './login.reducer';

export const rootReducer = combineReducers<{}>({
  auth: AuthReducer
});
