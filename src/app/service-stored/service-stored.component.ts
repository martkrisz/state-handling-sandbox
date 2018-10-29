import { AuthService } from './auth.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-service-stored',
  templateUrl: './service-stored.component.html',
  styleUrls: ['./service-stored.component.scss']
})
export class ServiceStoredComponent implements OnInit {

  isLoggedIn$: Observable<boolean>;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.isLoggedIn$ = this.authService.loggedInAsObservable();
    this.isLoggedIn$.subscribe();
  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }
}
