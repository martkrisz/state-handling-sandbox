import { NodeSubject } from './NodeSubject';
import { Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

export class Store<T extends Object = any> {
  private state: T;
  private state$: NodeSubject<T>;

  constructor() {
    this.state = <T>{};
    this.state$ = new NodeSubject<T>(this.state, null, 'state$');
    Object.defineProperty(this, 'state', {
      get: () => this.state$.value
    });
  }

  register(propertyPath: string[]) {
    let propertyName = '';
    let tempState = null;
    if (propertyPath.length === 1) {
      propertyName = propertyPath[0];
      tempState = this.state$;
    } else {
      for (let index = 0; index < propertyPath.length; ++index) {
        if (index < propertyPath.length - 1) {
          tempState = this.state$[propertyPath[index]];
        }
        if (tempState === undefined) {
          return;
        }
        if (index === propertyPath.length - 1) {
          propertyName = propertyPath[index];
        }
      }
    }
    if (!tempState[propertyName]) {
      propertyName = this.padWith$(propertyName);
      const newProperty = new NodeSubject<any>(null, tempState, propertyName);
      Object.defineProperty(tempState, propertyName, {
        enumerable: true,
        configurable: true,
        value: newProperty,
        writable: true
      });
      this.updateState();
    }
  }

  connect(propertyName: string): NodeSubject<any> {
    propertyName = this.padWith$(propertyName);
    const connectedProperty = new NodeSubject<any>(null, this.getSubstate(propertyName).parent, propertyName);
    connectedProperty.pipe(distinctUntilChanged()).subscribe(value => {
      this.getSubstate(propertyName).next(value);
    });
    this.getSubstate(propertyName)
      .pipe(distinctUntilChanged())
      .subscribe(value => {
        connectedProperty.next(value);
      });
    return connectedProperty;
  }

  connectAsReadonly(propertyName: string): Observable<any> {
    return this.getSubstate(propertyName).asObservable();
  }

  deleteSubstate(propertyName: string) {
    if (propertyName.endsWith('$')) {
      propertyName = propertyName + '$';
    }
    const propertyPath = propertyName.split('.');
    let tempState = null;
    if (propertyPath.length === 1) {
      propertyName = propertyPath[0];
      tempState = this.state$;
    } else {
      for (let index = 0; index < propertyPath.length; ++index) {
        if (index < propertyPath.length - 1) {
          tempState = this.state$[propertyPath[index]];
        }
        if (tempState === undefined) {
          return;
        }
        if (index === propertyPath.length - 1) {
          propertyName = propertyPath[index];
        }
      }
    }
    if (tempState[propertyName]) {
      this.getSubstate(propertyName).observers.forEach(observer => observer.complete());
      this.getSubstate(propertyName).complete();
      delete tempState[propertyName];
      this.updateState();
    }
  }

  emptyState() {
    this.state = null;
    this.state$.next(this.state);
    this.updateState();
  }

  getWholeStateSubject(): NodeSubject<T> {
    return this.state$;
  }

  getWholeState(): T {
    return this.state$.value;
  }

  getWholeStateAsObservable(): Observable<T> {
    return this.state$.asObservable();
  }

  getSubstate(propertyName: string): NodeSubject<any> {
    return this.state$[propertyName];
  }

  getSubstateAsObservable(propertyName: string): Observable<any> {
    return this.getSubstate(propertyName).asObservable();
  }

  getSubStateWithAccessor(accessor: (store) => any): NodeSubject<any> {
    return accessor(this.state$);
  }

  getSubStateWithAccessorAsReadonly(accessor: (store) => any): Observable<any> {
    return this.getSubStateWithAccessor(accessor).asObservable();
  }

  private updateState() {
    this.state$.next(this.state);
  }

  private padWith$(propertyName: string): string {
    if (propertyName.charAt(propertyName.length - 1) !== '$') {
      return propertyName.padEnd(propertyName.length + 1, '$');
    } else {
      return propertyName;
    }
  }

  private decorateWithAccessor(accessor: (store) => any, readonly?: boolean): PropertyDecorator {
    const _this = this;
    return function decorator(target: any, key: string, This = _this): void {
      function getter() {
        const value = readonly ? This.getSubStateWithAccessorAsReadonly(accessor) : This.getSubStateWithAccessor(accessor);
        return value;
      }

      if (delete target[key]) {
        Object.defineProperty(target, key, {
          value: getter(),
          enumerable: true,
          configurable: true,
          writable: true
        });
      }
    };
  }

  private decorate(path?: string, readonly?: boolean): PropertyDecorator {
    const _this = this;
    return function decorator(target: any, key: string, This = _this): void {
      function getter() {
        const value = readonly
          ? This.connectAsReadonly(path ? path.toString() : key.toString())
          : This.connect(path ? path.toString() : key.toString());
        return value;
      }

      if (delete target[key]) {
        Object.defineProperty(target, key, {
          value: getter(),
          enumerable: true,
          configurable: true,
          writable: true
        });
      }
    };
  }

  private decorateForRegister(path?: string[]): PropertyDecorator {
    const _this = this;
    return function decorator(target: any, key: string, This = _this): void {
      This.register(path ? path : [key.toString()]);
    };
  }

  public Connect(path?: string, readonly?: boolean): PropertyDecorator {
    return this.decorate(path, readonly);
  }

  public ConnectByAccessor(accessor: (store: T) => any, readonly?: boolean): PropertyDecorator {
    return this.decorateWithAccessor(accessor, readonly);
  }

  public Register(path?: string[] | string): PropertyDecorator {
    if (typeof path === 'string') {
      return this.decorateForRegister(path.split('.'));
    }
    return this.decorateForRegister(path);
  }
}
