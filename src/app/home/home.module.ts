import { NgModule } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';

import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { PreviewComponent } from '../preview/preview.component';
import { AngularSplitModule } from 'angular-split';
import { PreviewWindowComponent } from '../preview/preview-window/preview-window.component';
import { PreviewTableComponent } from '../preview/preview-table/preview-table.component';

@NgModule({
  declarations: [HomeComponent, PreviewComponent, PreviewWindowComponent, PreviewTableComponent],
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule,
    MatTableModule,
    NgFor,
    MatButtonModule,
    NgIf,
    MatIconModule,
    AngularSplitModule,
  ],
})
export class HomeModule {}
