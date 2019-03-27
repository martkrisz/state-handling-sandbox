import { Node } from './node';
import { HistoryFragment } from './history-fragment';
import { Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export class Store<T extends Object = any> {
  private state: T;
  private state$: Node<T>;
  private history: HistoryFragment[];
  private history$: Node<HistoryFragment[]>;

  constructor() {
    this.state = <T>{};
    this.history = [];
    this.state$ = new Node<T>(this.state, null, 'state$');
    this.history$ = new Node<HistoryFragment[]>(this.history, null, 'history$');
    this.history$.subscribe(history => {
      if (!environment.production && history.length) {
        console.log(history[history.length - 1]);
      }
    });
    this.updateHistory(null, this.state, 'INITIAL_STATE');
    this.getWholeStateAsObservable().subscribe(state => {
      let prevData = null;
      Object.keys(state).forEach(property => {
        state[property]
          .pipe(
            distinctUntilChanged((prev, curr) => {
              prevData = prev;
              return curr === prev;
            })
          )
          .subscribe(() => {
            this.updateHistory(prevData, state[property].value, `SUBSTATE_CHANGED_IN_${property}`);
          });
      });
    });
  }

  register(propertyPath: string[]) {
    const prevState = new Object(this.state);
    let propertyName = '';
    let tempState = null;
    if (propertyPath.length === 1) {
      propertyName = propertyPath[0];
      tempState = this.state;
    } else {
      for (let index = 0; index < propertyPath.length; ++index) {
        if (index < propertyPath.length - 1) {
          tempState = this.state[propertyPath[index]];
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
      const newProperty = new Node<any>(null, tempState, propertyName);
      Object.defineProperty(tempState, propertyName, {
        enumerable: true,
        configurable: true,
        value: newProperty
      });
      this.updateHistory(prevState, this.state, `REGISTERED ${propertyName}`);
      this.updateState();
    } else {
      this.updateHistory(prevState, this.state, `REGISTRATION_ATTEMPT_ALREADY_REGISTERED ${propertyName}`);
    }
  }

  connect(propertyName: string): Node<any> {
    propertyName = this.padWith$(propertyName);
    const connectedProperty = new Node<any>(null, this.getSubstate(propertyName));
    connectedProperty.pipe(distinctUntilChanged()).subscribe(value => {
      this.getSubstate(propertyName).next(value);
    });
    this.getSubstate(propertyName)
      .pipe(distinctUntilChanged())
      .subscribe(value => {
        connectedProperty.next(value);
      });
    this.updateHistory(this.state, this.state, `CONNECTED_READ_WRITE ${propertyName}`);
    return connectedProperty;
  }

  connectAsReadonly(propertyName: string): Observable<any> {
    this.updateHistory(this.state, this.state, `CONNECTED_READONLY ${propertyName}`);
    return this.getSubstate(propertyName).asObservable();
  }

  deleteSubstate(propertyName: string) {
    const prevState = new Object(this.state);
    if (this.state[propertyName]) {
      this.getSubstate(propertyName).observers.forEach(observer => observer.complete());
      this.getSubstate(propertyName).complete();
      delete this.state[propertyName];
      this.updateState();
      this.updateHistory(prevState, this.state, `SUBSTATE ${propertyName} DELETED`);
    }
  }

  emptyState() {
    const prevState = new Object(this.state);
    this.state = null;
    this.updateState();
    this.updateHistory(prevState, this.state, 'STATE_EMPTIED');
  }

  getWholeState(): Object {
    return this.state$.value;
  }

  getWholeStateAsObservable(): Observable<Object> {
    return this.state$.asObservable();
  }

  getSubstate(propertyName: string): Node<any> {
    return this.state[propertyName];
  }

  getSubstateAsObservable(propertyName: string): Observable<any> {
    return this.getSubstate(propertyName).asObservable();
  }

  getSubStateWithAccessor(accessor: (store) => any): Node<any> {
    return accessor(this.state);
  }

  getSubStateWithAccessorAsReadonly(accessor: (store) => any): Observable<any> {
    return this.getSubStateWithAccessor(accessor).asObservable();
  }

  getHistory(): Node<HistoryFragment[]> {
    return this.history$;
  }

  getHistoryPromisified(): Promise<HistoryFragment[]> {
    return this.history$.toPromise();
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

  private updateHistory(prevState: any, nextState: any, causingEvent: string) {
    this.history.push(new HistoryFragment(prevState, nextState, causingEvent));
    this.history$.next(this.history);
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
          configurable: true
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
          configurable: true
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
