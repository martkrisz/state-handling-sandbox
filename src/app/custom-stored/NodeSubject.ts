import { BehaviorSubject, of } from 'rxjs';

export class NodeSubject<T> extends BehaviorSubject<T> {

  private propertyName: string;
  public children: any;
  public parent: NodeSubject<any> | null;

  constructor(value: T, parentReference, propertyName?: string) {
    super(value);
    this.parent = <NodeSubject<typeof parentReference>>parentReference || null;
    this.propertyName = propertyName || '';
    this.children = {};
  }

  getChildren() {
    return this.children;
  }

  getChildrenAsObservable() {
    return of(this.children);
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
  }
}
