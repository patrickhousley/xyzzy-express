import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';

import { AppComponent } from 'src/web/app/app.component';
import { AppRoutingModule } from 'src/web/app/app-routing.module';

@NgModule({
  imports: [BrowserModule, HttpModule, AppRoutingModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
