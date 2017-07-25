import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Params } from '@angular/router';

@Injectable()
export class ActivatedRouteStub {
  private queryParamsSubject: BehaviorSubject<Params> = new BehaviorSubject<
    Params
  >({});
  public queryParams: Observable<Params>;

  constructor() {
    this.queryParams = this.queryParamsSubject.asObservable();
  }

  public setQueryParams(params: Params): void {
    this.queryParamsSubject.next(params);
  }
}
