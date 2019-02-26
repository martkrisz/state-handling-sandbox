import { Injectable } from '@angular/core';
import { Store } from './store';

@Injectable({
  providedIn: 'root'
})
export class StoreHelperService {
  public static store: Store = new Store();

  constructor() {}
}

export function getHistoryPromisified(): Promise<any[]> {
  return StoreHelperService.store.getHistoryPromisified();
}

export function connect(path?: string, readonly?: boolean): PropertyDecorator {
  return decorate(path, readonly);
}

export function connectByAccessor(accessor: Function, readonly?: boolean): PropertyDecorator {
  return decorateWithAccessor(accessor, readonly);
}

export function register(path?: string): PropertyDecorator {
  return decorateForRegister(path);
}

function decorateWithAccessor(accessor: Function, readonly?: boolean): PropertyDecorator {
  return function decorator(target: any, key: string): void {
    function getter() {
      const value = readonly
        ? StoreHelperService.store.getSubStateWithAccessorAsReadonly(accessor)
        : StoreHelperService.store.getSubStateWithAccessor(accessor);
      return value;
    }

    if (delete target[key]) {
      Object.defineProperty(target, key, {
        value: getter()
      });
    }
  };
}

function decorate(path?: string, readonly?: boolean): PropertyDecorator {
  return function decorator(target: any, key: string): void {
    function getter() {
      const value = readonly
        ? StoreHelperService.store.connectAsReadonly(path ? path.toString() : key.toString())
        : StoreHelperService.store.connect(path ? path.toString() : key.toString());
      return value;
    }

    if (delete target[key]) {
      Object.defineProperty(target, key, {
        value: getter()
      });
    }
  };
}

function decorateForRegister(path?: string): PropertyDecorator {
  return function decorator(target: any, key: string): void {
    StoreHelperService.store.register(path ? path.toString() : key.toString());
  };
}
