/**
 * @description
 * This service contains different useful methods to show
 * different types of alerts and confirmations
 */
import { Injectable } from '@angular/core';
import swal, { SweetAlertType } from 'sweetalert2';
import { Observable } from 'rxjs';

/**
 * @description
 * This service contains different useful methods to show
 * different types of alerts and confirmations
 * All the methods have self explainotory names. Hence separate description is not provided for each method
 */
@Injectable(
    { providedIn: 'root' }
)
export class AlertService {

    constructor(
    ) { }

    showSuccessAlert(msg: string) {
        swal({
            type: 'success',
            title: 'Success',
            text: msg,
        });
    }

    showErrorAlert(msg: string) {
        swal({
            text: msg,
        });
    }

    /**used to show a btn(not 'OK') with alert to execute some task */
    showErrorAlertWithBtn(msg: string, btnText: string, clbk: Function) {
        return swal({
            text: msg,
            confirmButtonText: btnText,
            preConfirm: () => clbk(),
            allowOutsideClick: false
        });
    }

    /**used to show a btn(not 'OK') and cancel with alert to execute some task */
    showErrorAlertWithTwoBtn(msg: string, btnText: string) {
        return swal({
            text: msg,
            confirmButtonText: btnText,
            showCancelButton: true,
            //  preConfirm: () => clbk(),
            //  allowOutsideClick: false
        });
    }

    showSuccessToast(msg: string, type?: SweetAlertType) {
        return swal({
            type: type || 'success',
            title: msg,
            position: 'top',
            showConfirmButton: false,
            timer: 1500
        });

    }

    /**
     * Prompts user a confirmation pop-up. Sends some request on confirm button and returns its response to
     * asynchronously
     */
    // tslint:disable-next-line:max-line-length
    confirmWithLoader(request: Observable<any>, type: SweetAlertType, msg: string, text: string, cnfrmBtnText = 'Yes, Delete !', cnfrmBtnColor = '#d33') {
        return swal({
            title: msg,
            type: type,
            text: text || '',
            showCancelButton: true,
            confirmButtonText: cnfrmBtnText,
            confirmButtonColor: cnfrmBtnColor,
            cancelButtonColor: '#3085d6',
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return new Promise((resolve, reject) => {

                    request.subscribe(
                        (res: any) => resolve(res),
                        (err: any) => reject(err)
                    );
                });
            },
            allowOutsideClick: () => !swal.isLoading()
        });
    }

    showLoader(msg: string) {
        swal({
            title: 'Please wait...',
            html: msg,
            allowOutsideClick: () => !swal.isLoading(),
            onOpen: () => {
                swal.showLoading();
            },
        });
    }

    closeLoader() {
        swal.close();
    }
}

