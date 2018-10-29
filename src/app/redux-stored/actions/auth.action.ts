import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';

@Injectable()
export class AuthActions {
  static LOGGED_IN = 'LOGGED_IN';
  static LOGGED_OUT = 'LOGGED_OUT';
  constructor(private ngRedux: NgRedux<any>) {}

  dispatchLogin() {
    this.ngRedux.dispatch(this.login());
  }

  dispatchLogout() {
    this.ngRedux.dispatch(this.logout());
  }

  private login() {
    return {
      type: AuthActions.LOGGED_IN,
      payload: true
    };
  }

  private logout() {
    return {
      type: AuthActions.LOGGED_OUT,
      payload: false
    };
  }
}
