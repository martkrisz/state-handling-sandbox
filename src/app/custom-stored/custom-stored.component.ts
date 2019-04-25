import { NodeSubject } from './NodeSubject';
import { myStore } from './MyStore';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-custom-stored',
  templateUrl: './custom-stored.component.html',
  styleUrls: ['./custom-stored.component.scss']
})
export class CustomStoredComponent implements OnInit {

  @myStore.Connect()
  @myStore.Register()
  isLoggedIn$: NodeSubject<Boolean>;

  @myStore.Connect('isLoggedIn$', true)
  isLoggedInReadonly$: Observable<Boolean>;

  @myStore.ConnectByAccessor(store => store.isLoggedIn$)
  isLoggedInByAccessor$: NodeSubject<Boolean>;

  @myStore.Connect()
  @myStore.Register()
  auth$: NodeSubject<Object>;

  @myStore.ConnectByAccessor(store => store.auth$.isLoggedIn$)
  @myStore.Register(['auth$', 'isLoggedIn'])
  isLoggedIn: NodeSubject<Boolean>;

  authChildren$: Observable<Object> = this.auth$.getChildrenAsObservable();
  authChildren: Object = this.auth$.getChildren();

  constructor() {}

  ngOnInit() {
    this.authChildren$.subscribe(console.log);
  }

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
    setTimeout(() => {
      this.auth$.getChildren();
    }, 1000);
  }

  logoutNested() {
    this.isLoggedIn.next(false);
  }
}
