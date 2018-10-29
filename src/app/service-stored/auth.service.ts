import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn: BehaviorSubject<boolean>;
  constructor() {
    this.loggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());
  }

  isLoggedIn() {
    if (localStorage.getItem('loginStatus')) {
      return true;
    } else {
      return false;
    }
  }

  login() {
    console.log(this.isLoggedIn());
    localStorage.setItem('loginStatus', 'true');
    this.loggedIn.next(true);
  }

  logout() {
    localStorage.removeItem('loginStatus');
    this.loggedIn.next(false);
  }

  loggedInAsObservable() {
    return this.loggedIn.asObservable();
  }
}
