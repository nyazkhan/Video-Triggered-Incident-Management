/**
 * @description
 * Component for password reset form
 */
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';

/**
 * @description
 * Component for password reset form
 */
@Component({
  selector: 'app-forgot-pwd',
  templateUrl: './forgot-pwd.component.html',
  styleUrls: ['../login/login.component.scss']
})
export class ForgotPwdComponent implements OnInit {

  /**form cotrol instance for password reset form */
  forgotPwdForm: FormGroup;
  /**to enable/disable submit button */
  requesting = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.createForm();
  }

  /**getter property to easy access of newPwdsGrp FormGroup in html */
  get newPwdsGrp() { return this.forgotPwdForm.get('pwds').get('newPwds'); }

  /**creates initial form containing only username @class FormControl*/
  createForm = () => {
    this.forgotPwdForm = this.fb.group({
      username: ['ajaygarg01', Validators.required],
    });
  }

  /**extends the @property forgotPwdForm to include other controls */
  extendForm() {
    this.forgotPwdForm.addControl('pwds', this.createSubForm());
  }

  /**
   * creates and returns sub-form to append to main form
  //  *    @returns {FormGroup}
   */
  createSubForm() {
    return new FormGroup({
      generatedPassword: new FormControl('', [Validators.required]),
      newPwds: new FormGroup({
        newPassword: new FormControl('', [Validators.minLength(2)]),
        newPasswordConfirm: new FormControl('', [Validators.required, Validators.minLength(2)]),
      }, this.passwordMatchValidator)
    });
  }

  /**custom validator to check if new password and confirm new password inputs are smae or not */
  passwordMatchValidator(subForm: FormGroup) {
    return subForm.get('newPassword').value === subForm.get('newPasswordConfirm').value
      ? null : { 'mismatch': true };
  }

  /**Called on click of form submit button  */
  onSubmit() {
    // console.log(this.forgotPwdForm.value);
    if (!this.forgotPwdForm.contains('pwds')) {
      this.generateTempPwd();
    } else {
      this.submitNewPassword();
    }
  }

  /**Requests to generate temperory password, extends main form */
  generateTempPwd() {
    this.requesting = true;
    this.authService.forgotPassword(this.forgotPwdForm.value.username)
      .subscribe((res: any) => {
        this.alertService.showSuccessAlert('A password has been generated and sent to your email. Please use that to reset password');
        this.extendForm();
        this.requesting = false;
      }, (err: any) => {
        this.requesting = false;
      });
  }

  /**Submit new password to server */
  submitNewPassword() {
    const payLoad: any = {
      username: this.forgotPwdForm.value.username,
      generatedPassword: this.forgotPwdForm.value.pwds.generatedPassword,
      password: this.forgotPwdForm.value.pwds.newPwds.newPassword
    };

    this.requesting = true;
    this.authService.resetPassword(payLoad)
      .subscribe((res: any) => {
        this.alertService.showSuccessAlert('Password reset successfull. Please login with new password.');
        this.requesting = false;
        this.forgotPwdForm.reset();
      }, (err: any) => {
        this.requesting = false;
      });
  }



}
