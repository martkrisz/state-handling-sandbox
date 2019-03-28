import { Store } from './Store';
import { ExampleInterface } from './ExampleInterface';


class MyStore extends Store<ExampleInterface> {

}

export const myStore: MyStore = new MyStore();
