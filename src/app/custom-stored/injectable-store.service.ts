import { Injectable } from '@angular/core';
import { Store } from './store';

@Injectable({
  providedIn: 'root'
})
export class InjectableStoreService extends Store {

  constructor() {
    super();
  }
}
