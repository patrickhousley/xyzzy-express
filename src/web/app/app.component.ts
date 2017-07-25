import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'xyzzy-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {}
