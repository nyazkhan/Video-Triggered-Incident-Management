import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlRoomComponent } from './control-room.component';
import { AddUserComponent } from './add-user/add-user.component';
import { HeaderModule } from '../header/header.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ControlRoomService } from 'src/app/services/control-room.service';
import { ConfigEquipModalComponent } from './config-equip-modal/config-equip-modal.component';

@NgModule({
  declarations: [ControlRoomComponent,
    ConfigEquipModalComponent,
    AddUserComponent],
  imports: [
    CommonModule,
    HeaderModule, // HeaderModule exports CommonModule. so no need to import CommonModule here
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: 'register',
        component: AddUserComponent
      },
      {
        path: '',
        component: ControlRoomComponent
      },

    ])
  ],
  providers: [ControlRoomService],
})
export class ControlRoomModule { }
