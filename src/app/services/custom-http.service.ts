/**
 * @description
 * Service that wraps the angular HTTPClient service and provides the 
 * overriding method for each requests.
 * Add required headers with each request.
 * Handles global error handling.
 * 
 * This service should be used wherever an http request is to be sent instead of 
 * directly using HTTTPClient service.
 * All methods are self-explainatory
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { BASE_URL } from './app.constants';
import { AlertService } from './alert.service';

/**
 * @description
 * Service that wraps the angular HTTPClient service and provides the 
 * overriding method for each requests.
 * Add required headers with each request.
 * Handles global error handling.
 * 
 * This service should be used wherever an http request is to be sent instead of 
 * directly using HTTTPClient service.
 * All methods are self-explainatory
 */
@Injectable({
    providedIn: 'root'
})
export class CustomHttpService {

    constructor(private httpClient: HttpClient, private alertService: AlertService) { }

    private getAccessToken() {

        const basicToken = 'efkon-atcs:nxtlife';

        return !localStorage.getItem('access_token') ? 'Basic ' + btoa(basicToken) : 'Bearer ' + localStorage.getItem('access_token');
    }

    private addHeaders(optionalHeaders?: HttpHeaders) {

        let requestHeaders = new HttpHeaders()
            .set('Authorization', this.getAccessToken());

        if (optionalHeaders) {
            for (const header of optionalHeaders.keys()) {
                requestHeaders = requestHeaders.append(header, optionalHeaders.get(header));
            }
        }
        return requestHeaders;
    }



    get(url: string, options?: HttpHeaders, useGlobalErrorHandler = true) {

        const headers = this.addHeaders(options);

        return this.httpClient.get(BASE_URL + url, { headers: headers, observe: 'response' })
            .map(this.extractData)
            .catch((err: HttpErrorResponse) => this.handleError(err, useGlobalErrorHandler));
    }

    post(url: string, body: any, options?: HttpHeaders, useGlobalErrorHandler = true) {

        const headers = this.addHeaders(options);

        return this.httpClient.post(BASE_URL + url, body, { headers: headers, observe: 'response' })
            .map(this.extractData)
            .catch((err: HttpErrorResponse) => this.handleError(err, useGlobalErrorHandler));
    }

    put(url: string, body: any, options?: HttpHeaders, useGlobalErrorHandler = true) {

        const headers = this.addHeaders(options);

        return this.httpClient.put(BASE_URL + url, body, { headers: headers, observe: 'response' })
            .map(this.extractData)
            .catch((err: HttpErrorResponse) => this.handleError(err, useGlobalErrorHandler));
    }

    delete(url: string, options?: HttpHeaders, useGlobalErrorHandler = true) {

        const headers = this.addHeaders(options);

        return this.httpClient.delete(BASE_URL + url, { headers: headers, observe: 'response' })
            .map(this.extractData)
            .catch((err: HttpErrorResponse) => this.handleError(err, useGlobalErrorHandler));
    }

    private extractData(res: HttpResponse<any>) {

        // console.log('inside extract data', res);
        return res.body || res.status;
    }

    private handleError(err: HttpErrorResponse, useGlobalErrorHandler: boolean) {
        const errorInfo: any = {};

        if (err.error instanceof Error || err.error instanceof ProgressEvent) {
            /**A client-side or network error occurred. Handle it accordingly.*/
            // console.log('An error occurred:', );
            errorInfo.status = err.status;
            errorInfo.status === 0 ?
                errorInfo.msg = 'Some error occured, Couldn\'t connect to server' :
                errorInfo.msg = err.message || 'Some Error Occured';
        } else {
            /**The backend returned an unsuccessful response code.*/
            // console.log('Server occurred:', err);
            errorInfo.status = err.status;
            errorInfo.msg = err.error.message || err.error.error || 'Some error occured, Couldn\'t connect to server';
        }

        if (useGlobalErrorHandler) { this.showErrorAlert(errorInfo); }
        return Observable.throw(errorInfo);

    }

    showErrorAlert(errorInfo: any) {
        // check for 401 error so that a Logout btn can be given with that
        if (errorInfo.status === 401) {
            this.alertService.showErrorAlertWithBtn(
                'Session Expired',
                'Logout',
                () => {
                    localStorage.clear();
                    window.location.reload();
                }
            );
            return;
        }
        this.alertService.showErrorAlert(errorInfo.msg);
    }

}
