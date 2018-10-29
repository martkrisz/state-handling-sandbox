import { AuthActions } from './../actions/auth.action';

export function AuthReducer(state = {}, action) {
  switch (action.type) {
    case AuthActions.LOGGED_IN:
      return Object.assign({}, state, { isLoggedIn: action.payload });
    case AuthActions.LOGGED_OUT:
      return Object.assign({}, state, { isLoggedIn: action.payload });
    default:
      return state;
  }
}
