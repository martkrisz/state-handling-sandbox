import { Injectable } from '@angular/core';
import { Store } from './Store';

@Injectable({
  providedIn: 'root'
})
export class StoreService extends Store {

  constructor() {
    super();
  }
}
