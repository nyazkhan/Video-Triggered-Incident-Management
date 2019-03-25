import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { RouterModule } from '@angular/router';

@NgModule({

  imports: [RouterModule, CommonModule],
  declarations: [HeaderComponent],
  exports: [HeaderComponent, CommonModule]
})
export class HeaderModule { }
