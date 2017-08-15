import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  ContentChild
} from '@angular/core';
import { ObservableMedia } from '@angular/flex-layout';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MdSidenav } from '@angular/material';

@Component({
  selector: 'xyzzy2-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  @ContentChild(MdSidenav) private sidenav: MdSidenav;
  private openSidenavSubject = new BehaviorSubject<boolean>(false);

  public collapseSideNav$: Observable<boolean>;
  public openSidenave$: Observable<boolean>;

  constructor(private media: ObservableMedia) {}

  public ngOnInit() {
    this.openSidenave$ = this.openSidenavSubject.asObservable();
    this.collapseSideNav$ = this.media
      .asObservable()
      .map(() => this.media.isActive('xs') || this.media.isActive('sm'))
      .startWith(this.media.isActive('xs') || this.media.isActive('sm'))
      .do(isSmall => {
        if (isSmall) {
          // Reset the sidenav to be closed
          this.openSidenavSubject.next(false);
        }
      });
  }

  public toggleSidenav() {
    if (this.sidenav && !this.sidenav.opened) {
      this.openSidenavSubject.next(true);
    } else if (this.sidenav && this.sidenav.opened) {
      this.openSidenavSubject.next(false);
    }
  }
}
