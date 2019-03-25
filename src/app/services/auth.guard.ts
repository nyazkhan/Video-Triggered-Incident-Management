/**
 * @description
 * Guard that restricts users to inside the app when they are not logged in
 */
import { CanActivate, Router, CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

/**
 * @description
 * Guard that restricts users to inside the app when they are not logged in
 */
@Injectable(
  { providedIn: 'root' }
)
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  canActivate() {
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigateByUrl('/login');
      return false;
    }
  }

}
