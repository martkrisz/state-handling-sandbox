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
    this.handleParentChildren(value);
  }

  getChildren() {
    return this.children;
  }

  getChildrenAsObservable() {
    return this.children$.asObservable();
  }

  next(value: T): void {
    super.next(value);
    this.handleParentChildren(value);
  }

  private handleParentChildren(value) {
    if (this.parent && this.propertyName !== '' && this.parent.children[this.propertyName] === undefined) {
      this.parent.children = Object.defineProperty(this.parent.children, this.propertyName, {
        enumerable: true,
        configurable: true,
        writable: true,
        value
      });
    } else if (this.parent && this.parent.children[this.propertyName] !== undefined && this.propertyName !== '') {
      this.parent.children[this.propertyName] = value;
      this.parent.children$.next(this.parent.children);
    }
  }
}
