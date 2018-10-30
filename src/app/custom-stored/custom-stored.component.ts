import { Store } from './store';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-custom-stored',
  templateUrl: './custom-stored.component.html',
  styleUrls: ['./custom-stored.component.scss']
})
export class CustomStoredComponent implements OnInit {
  isLoggedIn$: BehaviorSubject<any>;
  isLoggedInReadonly$: Observable<any>;
  constructor(private store: Store) {
    this.isLoggedIn$ = new BehaviorSubject<any>(false);
  }

  ngOnInit() {
    this.store.register('isLoggedIn', this.isLoggedIn$.value);
    this.isLoggedIn$ = this.store.connect('isLoggedIn', this.isLoggedIn$.value);
    this.isLoggedInReadonly$ = this.store.connectAsReadonly('isLoggedIn', this.isLoggedIn$.value);
  }

  login() {
    this.isLoggedIn$.next(true);
  }

  logout() {
    this.isLoggedIn$.next(false);
  }
}
