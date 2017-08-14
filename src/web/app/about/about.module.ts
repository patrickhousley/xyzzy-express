import { SharedModule } from 'src/web/app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AboutRoutingModule } from 'src/web/app/about/about-routing.module';
import { AboutComponent } from 'src/web/app/about/about.component';

@NgModule({
  imports: [
    CommonModule,
    AboutRoutingModule,
    SharedModule
  ],
  declarations: [
    AboutComponent
  ],
  providers: [
  ]
})
export class AboutModule { }
