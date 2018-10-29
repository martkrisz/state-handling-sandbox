import { AuthActions } from './actions/auth.action';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { select } from '@angular-redux/store';

@Component({
  selector: 'app-redux-stored',
  templateUrl: './redux-stored.component.html',
  styleUrls: ['./redux-stored.component.scss']
})
export class ReduxStoredComponent implements OnInit {
  @select(['auth', 'isLoggedIn'])
  isLoggedIn$: Observable<boolean>;

  constructor(private authActions: AuthActions) { }

  ngOnInit() { }

  login() {
    this.authActions.dispatchLogin();
  }

  logout() {
    this.authActions.dispatchLogout();
  }
}
