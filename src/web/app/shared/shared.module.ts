import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MdToolbarModule, MdCardModule, MdMenuModule, MdSidenavModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [CommonModule, FlexLayoutModule, MdToolbarModule, MdCardModule, MdMenuModule, MdSidenavModule],
  exports: [FlexLayoutModule, MdToolbarModule, MdCardModule, MdMenuModule, MdSidenavModule]
})
export class SharedModule { }
