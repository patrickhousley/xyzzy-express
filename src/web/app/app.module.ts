import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from 'src/web/app/app-routing.module';
import { AppComponent } from 'src/web/app/app.component';
import { SharedModule } from 'src/web/app/shared/shared.module';
import { MaterialModule } from '@angular/material';

@NgModule({
  imports: [BrowserModule, BrowserAnimationsModule, HttpModule, AppRoutingModule, MaterialModule, SharedModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
