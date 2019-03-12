import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { connect, connectByAccessor, register } from './store-helper.service';

@Component({
  selector: 'app-custom-stored',
  templateUrl: './custom-stored.component.html',
  styleUrls: ['./custom-stored.component.scss']
})
export class CustomStoredComponent implements OnInit {
  @connect()
  @register()
  isLoggedIn$: BehaviorSubject<any>;
  @connect('isLoggedIn$', true)
  isLoggedInReadonly$: Observable<any>;
  @connectByAccessor(store => store.isLoggedIn$)
  isLoggedInByAccessor$: BehaviorSubject<any>;

  constructor() {}

  ngOnInit() {}

  login() {
    this.isLoggedIn$.next(true);
  }

  logout() {
    this.isLoggedIn$.next(false);
  }

  loginWithAccessor() {
    this.isLoggedInByAccessor$.next(true);
  }

  logoutWithAccessor() {
    this.isLoggedInByAccessor$.next(false);
  }
}
