import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ObservableMedia } from '@angular/flex-layout';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'xyzzy-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  public enableSideNav$: Observable<boolean>;

  constructor(private media: ObservableMedia) {
  }

  public ngOnInit() {
    this.enableSideNav$ = this.media.asObservable()
      .map(() =>
        this.media.isActive('xs') || this.media.isActive('sm')
      )
      .startWith(this.media.isActive('xs') || this.media.isActive('sm'));
  }
}
