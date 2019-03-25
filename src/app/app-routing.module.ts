
/**
 * @description
 * Handles the root routing of the app
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ForgotPwdComponent } from './components/forgot-pwd/forgot-pwd.component';
import { LoginGuard } from './services/login.guard';


/**Root level routes of app */

const Rootroutes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {

    path: 'dashboard',
     loadChildren: './modulse/dashboard/dashboard.module#DashboardModule',
   },
  {
    path: 'login',
    component: LoginComponent,
    // canActivate: [LoginGuard]
  },
  {
    path: 'forgot-pwd',
    component: ForgotPwdComponent,
    // canActivate: [LoginGuard]

  },
  { // to add users or config rsu and camera
    path: 'control-room',
    loadChildren: './modulse/control-room/control-room.module#ControlRoomModule',
  },




  {
    path: '**',
    redirectTo: 'login'
  }
];

/**
 * @description
 * Handles the root routing of the app
 */

@NgModule({
  imports: [RouterModule.forRoot(Rootroutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
