export class HistoryFragment {
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
