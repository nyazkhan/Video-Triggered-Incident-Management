import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ControlRoomService } from 'src/app/services/control-room.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['../../../components/login/login.component.scss']
})
export class AddUserComponent implements OnInit {
  /**list of cities from server */
  cities = [{name: 'faridabad'}, {name: 'rohtak'}, {name: 'ambala'}, {name: 'sonipat'}];
  /**list of user roles from server */
  roles = [{ name: 'Admin' }, { name: 'Supervisor' }, { name: 'Oprater' }];
  /**list of rsu from server */
  rsu: Array<any>;
  /**maximum cities that can be assigned to selected role, not used if selected role is master */
  MAXASSIGNCITIES = null;
  /**maximum rsu that can be assigned to role master, only used if selected role is master */
  MAXASSIGNJUNCTIONS = null;

  submitting = false;
  loadingJunctions = false;

  constructor(
    private authService: AuthService,
    private controlRoomService: ControlRoomService
  ) { }

  ngOnInit() {
    // this.cities = JSON.parse(localStorage.getItem('userInfo')).cities;
    // this.fetchRoles();
  }

  // Function to fetch role of the loggedin user
  fetchRoles() {
    // this.authService.getRoles()
    //   .subscribe((resp: any) => {
    //     this.roles = resp;
    //   }, (err: any) => { });
  }

  // Function to fetch the available junctions
  fetchJunctions() {
    // this.loadingJunctions = true;

    // this.controlRoomService.getJunctions()
    //   .subscribe((juncs: any) => {
    //     this.loadingJunctions = false;
    //     this.junctions = juncs;
    //   }, (err: any) => { this.loadingJunctions = false; });
  }

  // Function to return junctions on changing the roles
  onRoleChange(role: any) {
    // if (role.name !== 'Master') {
    //   this.MAXASSIGNCITIES = role.maxAssignedCity;
    // } else {
    //   this.fetchJunctions();
    // }
  }


  onSubmit(formValue: any) {
    // console.log(formValue);
    // cities in form will be avialble only in case of role other than master
    // if (formValue.role.name !== 'Master') {
    //   formValue['cityIds'] = formValue.cities.map((city: any) => city.id);
    //   delete formValue.cities;
    // }
    // formValue.roleId = formValue.role.id;
    // delete formValue.role;
    // this.submitting = true;
    // this.authService.registerUser(formValue)
    //   .subscribe((res: any) => {
    //     this.submitting = false;
    //   }, (err: any) => { this.submitting = false; });
  }

}
