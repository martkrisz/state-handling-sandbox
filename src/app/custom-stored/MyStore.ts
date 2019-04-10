import { Store } from './store';
import { ExampleInterface } from './ExampleInterface';

export class MyStore extends Store<ExampleInterface> {

}

export const myStore: MyStore = new MyStore();
