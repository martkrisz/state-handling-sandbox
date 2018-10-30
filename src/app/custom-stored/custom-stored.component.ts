import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-custom-stored',
  templateUrl: './custom-stored.component.html',
  styleUrls: ['./custom-stored.component.scss']
})
export class CustomStoredComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  constructor() {}

  ngOnInit() {}

  login() {}

  logout() {}
}
