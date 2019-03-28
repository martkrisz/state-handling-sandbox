import { BehaviorSubject, of } from 'rxjs';

export class Node<T> extends BehaviorSubject<T> {

  private propertyName: string;
  public children: any;
  public parent: Node<any> | null;

  constructor(value: T, parentReference, propertyName?: string) {
    super(value);
    this.parent = <Node<typeof parentReference>>parentReference || null;
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
      this.parent.children[this.propertyName] = value;
    }
  }
}
