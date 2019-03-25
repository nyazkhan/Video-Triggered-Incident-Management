/**
 * @description
 * Component that shows modal for Junction Equipment Configuration Form
 */
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ControlRoomService } from '../../../services/control-room.service';
import { forkJoin } from 'rxjs';
import { AlertService } from '../../../services/alert.service';
declare const $: any;

/**
 * @description
 * Component that shows modal for Junction Equipment Configuration Form
 */
@Component({
  selector: 'app-config-equip-modal',
  templateUrl: './config-equip-modal.component.html',
  styleUrls: ['./config-equip-modal.component.scss']
})
export class ConfigEquipModalComponent implements OnInit {

  constructor(
    private controlRoomService: ControlRoomService,
    private alertService: AlertService
  ) { }

   @Input() junctionInfo: any;
  /**New/edited Junction info to parent component(Map view) */
  @Output() configure: EventEmitter<any> = new EventEmitter(null);

  junctionTypes: Array<{ name: string, armCount: number }>;
  selectedJunctionType: any; // for showing default select value
  loading = false;

  tempFormattedAddress: string;
  // to disable editing important info such as type, position and various counts
  disableEditing = false;
  submitting = false;


  ngOnInit() {
    $('#juncEquipConfigModal').modal({ backdrop: 'static', keyboard: false });
    // this.getTypesAndJunctionInfo();
    // this.tempFormattedAddress = this.junctionInfo.formattedAddress;
    // // many important form-fields will be enabled only when status is 'JUNCTION_SET'
    // this.disableEditing = this.junctionInfo.configureStatus !== 'JUNCTION_SET';
  }

  getTypesAndJunctionInfo() {
    const typeR = this.controlRoomService.getJunctionTypes();
    const jInfoR = this.controlRoomService.getJunctionById(this.junctionInfo.id);
    this.loading = true;
    forkJoin([typeR, jInfoR])
      .subscribe(([t, junc]) => {
        this.loading = false;
        this.junctionTypes = t;
        this.junctionInfo = junc;
        this.selectedJunctionType = this.junctionTypes.find(j => j.name === this.junctionInfo.type);
      }, (err: any) => { this.loading = false; });
  }



  /**Called on form submit button */
  onSubmit(formValue: any) {
    const updatedTypeInfo = this.disableEditing ? {} : { type: formValue.type.name, armCount: formValue.type.armCount };
    const f = Object.assign(formValue, updatedTypeInfo);
    this.submitForm(f);
  }

  /**Checks if junction's position is changed, if yes, update the address of junction  */
  checkPositionChange(lng: number, lat: number) {
    if (this.isLocationChanged(lat, lng)) {
      this.getNewFormattedAddress(lat, lng)
        .then((newAddress: string) => {
          this.tempFormattedAddress = newAddress;
        });
    }
  }

  /**Checks if junction's position is changed */
  isLocationChanged(lat: number, lng: number) {
    return lat.toString() !== this.junctionInfo.latitude.toString() || lng.toString() !== this.junctionInfo.longitude.toString();
  }

  /** Fethces the new address of junction  */
  getNewFormattedAddress(lat: number, lng: number) {
    return new Promise((res, rej) => {
      this.controlRoomService.getJunctionAddress(lat, lng)
        .subscribe((resp: string) => { res(resp); }, (err: any) => { res(''); });
    });
  }

  /**Uploads the new/edited info to server */
  submitForm(formValue: any) {
    // validate ip address if provided
    if (formValue.ipAddress && !this.isIpAddressValid(formValue.ipAddress)) {
      this.alertService.showErrorAlert('Please Enter a valid IP address');
      return;
    }

    this.submitting = true;
    this.controlRoomService.submitJunctionEquipmentConfiguration(formValue, this.junctionInfo.id)
      .subscribe((res: any) => {
        this.submitting = false;
        this.onConfiguration(res);
      }, (err: any) => { this.submitting = false; });
  }

  /**Called on modal close button */
  onCloseBtn() {
    this.closeModal();
    this.configure.emit(null);
  }

  /**Updates junction info in parent component */
  onConfiguration(updatedInfo: any) {
    this.closeModal();
    this.configure.emit(updatedInfo);
  }

  /**Closes the modal */
  closeModal() {
    $('#juncEquipConfigModal').modal('hide');
  }

  isIpAddressValid(ip: string) {
    const reg = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return reg.test(ip);
  }
}
