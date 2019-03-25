/**
 * @description
 * This contains various methods and requests related to user authentication and registration
 *All methods have self explainatory names
 */
import { Injectable } from '@angular/core';
import { CustomHttpService } from './custom-http.service';

/**
 * @description
 * This contains various methods and requests related to user authentication and registration
 *All methods have self explainatory names
 */
@Injectable(
    { providedIn: 'root' }
)
export class AuthService {

    constructor(
        private http: CustomHttpService,
    ) { }

    login(data: any, useGlobalErrorHandler: boolean) {
        return this.http.post(`/oauth/token?grant_type=password&username=${data.username}&password=${data.password}`, {}
            , undefined, useGlobalErrorHandler);
    }

    isLoggedIn() { return localStorage.getItem('access_token') ? true : false; }

    saveToken(token: string) {
        localStorage.setItem('access_token', token);
    }

    fetchUserDetails(useGlobalErrorHandler: boolean) {
        return this.http.get('/api/me', undefined, useGlobalErrorHandler)
            .map((res) => {
                this.saveUserDetails(res);
                return res;
            });
    }

    saveUserDetails(userInfo: any) { localStorage.setItem('userInfo', JSON.stringify(userInfo)); }

    hasJunctionWritePermission() {
        const authorities: Array<any> = JSON.parse(localStorage.getItem('userInfo')).authorities;
        return authorities.some((auth: any) => auth.name === 'JUNCTION_WRITE');
    }

    hasMasterArchitectureConfigPermission() {
        const authorities: Array<any> = JSON.parse(localStorage.getItem('userInfo')).authorities;
        return authorities.some((auth: any) => auth.name === 'JUNCTION_CONFIGURE');
    }

    hasDetectorConfigPermission() {
        const authorities: Array<any> = JSON.parse(localStorage.getItem('userInfo')).authorities;
        // TODO: change below permission
        return authorities.some((auth: any) => auth.name === 'JUNCTION_CONFIGURE');
    }

    /**indicates server to send the OTP to user*/
    forgotPassword(username: string) {
        return this.http.get(`/forgot-password/${username}`);
    }

    resetPassword(payLoad: any) {
        return this.http.post(`/forgot-password`, payLoad);
    }

    getRoles() {
        return this.http.get(`/api/role`);
    }

    registerUser(data: any) {
        return this.http.post(`/api/user`, data);

    }


}
