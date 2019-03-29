import { Component, OnInit } from '@angular/core';
declare let $: any;

@Component({
  selector: 'app-config-file-modal',
  templateUrl: './config-file-modal.component.html',
  styleUrls: ['./config-file-modal.component.scss']
})
export class ConfigFileModalComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    // $('#configurationModalLabel').modal({ backdrop: 'static', keyboard: false });

  }

}
