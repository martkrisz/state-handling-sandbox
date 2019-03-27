import { Store } from './store';
import { ExampleInterface } from './example-interface';


class MyStore extends Store<ExampleInterface> {

}

export const myStore: MyStore = new MyStore();
