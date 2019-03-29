import { Component, OnInit, Input } from '@angular/core';
declare let $: any;
@Component({
  selector: 'app-add-camera',
  templateUrl: './add-camera.component.html',
  styleUrls: ['./add-camera.component.scss']
})
export class AddCameraComponent implements OnInit {
  // @Input() cameraInfo: any;
  cameraInfo = {
    name: 'nyaz',
    cameraId: 233,
    cameraIpAddress: '178.989.389.893',
    systemIpAddress: '393.399.393.399',
    textFileFolderPath: 'c/project/video',
    videoFileFolderPath: 'c/project/video',
    hardwareVersion: 1.22,
    softwareVersion: 1.22,

  };
  constructor() { }

  ngOnInit() {
    // $('#cameraModal').modal({ backdrop: 'static', keyboard: false });

  }
  onSubmit() {

  }

  onCloseBtn() {

  }
}
