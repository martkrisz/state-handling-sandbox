import { BehaviorSubject } from 'rxjs';

export class NodeSubject<T> extends BehaviorSubject<T> {
  private propertyName: string;
  public children: any;
  public children$: BehaviorSubject<any>;
  public parent: NodeSubject<any> | null;

  constructor(value: T, parentReference, propertyName?: string) {
    super(value);
    this.parent = <NodeSubject<typeof parentReference>>parentReference || null;
    this.propertyName = propertyName || '';
    this.children = {};
    this.children$ = new BehaviorSubject<any>(this.children);
  }

  getChildren() {
    return this.children;
  }

  getChildrenAsObservable() {
    return this.children$.asObservable();
  }

  next(value: T): void {
    super.next(value);
    if (this.parent && this.propertyName !== '') {
      Object.defineProperty(this.parent.children, this.propertyName, {
        enumerable: true,
        configurable: true,
        value
      });
    }
    if (this.parent) {
      this.parent.children$.next(this.parent.children);
    }
    if (this.propertyName === 'isLoggedIn$' && this.parent.propertyName === 'auth$') {
      console.log(this.parent.children);
      console.log(this.parent.children$.value);
    }
  }
}
