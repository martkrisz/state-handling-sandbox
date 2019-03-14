import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

class HistoryFragment {
  prevState: any;
  nextState: any;
  timeStamp: Date;
  causingEvent: string;

  constructor(prevState: any, nextState: any, causingEvent: string) {
    this.prevState = prevState;
    this.nextState = nextState;
    this.timeStamp = new Date();
    this.causingEvent = causingEvent;
  }
}

export class Store {
  private state: Object;
  private stateSubject: BehaviorSubject<Object>;
  private history: HistoryFragment[];
  private history$: BehaviorSubject<HistoryFragment[]>;

  constructor() {
    this.state = new Object();
    this.history = [];
    this.stateSubject = new BehaviorSubject<Object>(this.state);
    this.history$ = new BehaviorSubject<HistoryFragment[]>(this.history);
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
      const newProperty = new BehaviorSubject<any>(null);
      tempState[propertyName] = newProperty;
      this.updateHistory(prevState, this.state, `REGISTERED ${propertyName}`);
      this.updateState();
    } else {
      this.updateHistory(
        prevState,
        this.state,
        `REGISTRATION_ATTEMPT_ALREADY_REGISTERED ${propertyName}`
      );
    }
  }

  connect(propertyName: string): BehaviorSubject<any> {
    const connectedProperty = new BehaviorSubject<any>(null);
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
    return this.stateSubject.value;
  }

  getWholeStateAsObservable(): Observable<Object> {
    return this.stateSubject.asObservable();
  }

  getSubstate(propertyName: string): BehaviorSubject<any> {
    return this.state[propertyName];
  }

  getSubstateAsObservable(propertyName: string): Observable<any> {
    return this.getSubstate(propertyName).asObservable();
  }

  getSubStateWithAccessor(accessor: ((store) => any)): BehaviorSubject<any> {
    return accessor(this.state);
  }

  getSubStateWithAccessorAsReadonly(accessor: ((store) => any)): Observable<any> {
    return this.getSubStateWithAccessor(accessor).asObservable();
  }

  getHistory(): BehaviorSubject<HistoryFragment[]> {
    return this.history$;
  }

  getHistoryPromisified(): Promise<HistoryFragment[]> {
    return this.history$.toPromise();
  }

  private updateState() {
    this.stateSubject.next(this.state);
  }

  private updateHistory(prevState: any, nextState: any, causingEvent: string) {
    this.history.push(new HistoryFragment(prevState, nextState, causingEvent));
    this.history$.next(this.history);
  }
}

