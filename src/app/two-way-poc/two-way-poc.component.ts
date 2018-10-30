import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { filter, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-two-way-poc',
  templateUrl: './two-way-poc.component.html',
  styleUrls: ['./two-way-poc.component.scss']
})
export class TwoWayPocComponent implements OnInit {
  bs1: BehaviorSubject<string>;
  string1: string;
  bs2: BehaviorSubject<string>;
  string2: string;
  constructor() {
    this.bs1 = new BehaviorSubject<string>('');
    this.bs2 = new BehaviorSubject<string>('');
  }

  ngOnInit() {
    this.bs1.subscribe(data => {
      this.bs2.next(data);
    });

    this.bs2.pipe(distinctUntilChanged()).subscribe(data => {
      this.bs1.next(data);
    });
  }

  handleFirst() {
    this.bs1.next(this.string1);
  }

  handleSecond() {
    this.bs2.next(this.string2);
  }
}
