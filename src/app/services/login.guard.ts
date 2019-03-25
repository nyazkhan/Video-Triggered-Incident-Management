
/**
 * @description
 * Guard that restricts users to go to  login page when they are logged in
 */
import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

/**
 * @description
 * Guard that restricts users to go to  login page when they are logged in
 */
@Injectable(
    { providedIn: 'root' }
)
export class LoginGuard implements CanActivate {

    constructor(
        private router: Router,
        private authService: AuthService
    ) { }

    canActivate() {
        if (!this.authService.isLoggedIn()) {
            return true;
        } else {
            this.router.navigate(['/control-room']);
            return false;
        }
    }

}
