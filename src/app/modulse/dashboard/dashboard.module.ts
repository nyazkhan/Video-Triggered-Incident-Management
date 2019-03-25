import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { GoogleChartDirective } from 'src/app/directive/google-chart.directive';
import { RouterModule } from '@angular/router';
import { HeaderModule } from '../header/header.module';
import { SidebarModule } from '../sidebar/sidebar.module';

@NgModule({
  declarations: [
    DashboardComponent,
    GoogleChartDirective
  ],
  imports: [
    CommonModule,
    HeaderModule,
    SidebarModule,
    RouterModule.forChild([{ path: '', component: DashboardComponent }])
  ]
})
export class DashboardModule { }
