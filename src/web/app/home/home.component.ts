import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'xyzzy-home',
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent { }
