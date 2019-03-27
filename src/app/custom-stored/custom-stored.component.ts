import { myStore } from './my-store';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-custom-stored',
  templateUrl: './custom-stored.component.html',
  styleUrls: ['./custom-stored.component.scss']
})
export class CustomStoredComponent implements OnInit {

  @myStore.Connect()
  @myStore.Register()
  auth$: BehaviorSubject<Object>;

  @myStore.ConnectByAccessor(store => store.auth$.isLoggedIn$)
  @myStore.Register(['auth$', 'isLoggedIn'])
  isLoggedIn: BehaviorSubject<Boolean>;

  @myStore.Connect()
  @myStore.Register()
  isLoggedIn$: BehaviorSubject<Boolean>;

  @myStore.Connect(
    'isLoggedIn$',
    true
  )
  isLoggedInReadonly$: Observable<Boolean>;

  @myStore.ConnectByAccessor(store => store.isLoggedIn$)
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
