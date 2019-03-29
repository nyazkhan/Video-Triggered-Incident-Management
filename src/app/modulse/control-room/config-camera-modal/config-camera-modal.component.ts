import { Component, OnInit } from '@angular/core';
declare let $: any;

@Component({
  selector: 'app-config-camera-modal',
  templateUrl: './config-camera-modal.component.html',
  styleUrls: ['./config-camera-modal.component.scss']
})
export class ConfigCameraModalComponent implements OnInit {
  showAddCameraModal = false;
  markerBeingConfigured: any;
  constructor() { }

  ngOnInit() {
    // $('#configureCameraModal').modal({ backdrop: 'static', keyboard: false });

  }
  editCameraDetials(id) {
    $('#configureCameraModal').modal('hide');
    $('#cameraModal').modal({ backdrop: 'static', keyboard: false });

  }
  addCamera() {
    $('#configureCameraModal').modal('hide');
    $('#cameraModal').modal({ backdrop: 'static', keyboard: false });
  }

}
