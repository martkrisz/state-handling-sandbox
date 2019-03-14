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
  auth$: BehaviorSubject<Object>;

  @register(['auth$', 'isLoggedIn'])
  @connectByAccessor(store => store.auth$.isLoggedIn)
  isLoggedIn: BehaviorSubject<Boolean>;

  @connect()
  @register()
  isLoggedIn$: BehaviorSubject<Boolean>;

  @connect('isLoggedIn$', true)
  isLoggedInReadonly$: Observable<Boolean>;

  @connectByAccessor(store => store.isLoggedIn$)
  isLoggedInByAccessor$: BehaviorSubject<Boolean>;

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

  loginNested() {
    this.isLoggedIn.next(true);
  }

  logoutNested() {
    this.isLoggedIn.next(false);
  }
}
