import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MAPBOX_TOKEN, BASE_URL } from '../../services/app.constants';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/services/alert.service';
import { ControlRoomService } from 'src/app/services/control-room.service';


/**For accessing global leaflet.js variable */
declare const L: any;
/**For accessing global jquery variable */
declare const $: any;
/**interface for new junction being created */
interface RSUInfo {
  type: { name: string; armCount: number };
  name: string;
  ipAddress: string;
  pos: {
    lat: number;
    lng: number;
  };
  landmark: string;
}

/**Enum for marker(Junction) icon on map. Depends on @enum MarkerStatus*/
enum MarkerIcon {
  New_Draggable = 'assets/svg/red_pin.svg',
  Configured = 'assets/svg/green_pin.svg',
  Equipment_Configured = 'assets/svg/orange_pin.svg',
  Not_Configured = 'assets/svg/yellow_pin.svg'
  // New_Pin = 'assets/svg/green_pin.svg'
}


/**Enum for possible status of marker(Junction). Status keeps track of the junction progress*/
export enum MarkerStatus {
  // possible values of marker's status property (marker.status)
  New_Draggable = 'NEWDRAGGABLE', // New_Draggable is used only at client side, not present in database
  Not_Configured = 'NOTCONFIGURED',
  Equipment_Configured = 'EQUIPMENT_CONFIGURED',
  Configured = 'CONFIGURED',
  // below marker status tells about progress of junction configuration
  // possible values of marker's configureStatus property (marker.configureStatus)
  Junction_Set = 'JUNCTION_SET',
  Equipment_Count_Set = 'EQUIPMENT_COUNT_SET',
  Master_Configure = 'MASTER_CONFIGURE',
  Detector_Configure = 'DETECTOR_CONFIGURE',
  Slave_Configure = 'SLAVE_CONFIGURE',
  Pole_Configure = 'POLE_CONFIGURE',
  Lamp_Configure = 'LAMP_CONFIGURE'
}


@Component({
  selector: 'app-control-room',
  templateUrl: './control-room.component.html',
  styleUrls: ['./control-room.component.scss']
})
export class ControlRoomComponent implements OnInit {

  /**To access the native html  div element which hosts map */
  @ViewChild('map') mapRef: ElementRef;
  /**To access the native html  div element which hosts filter controls group */
  // @ViewChild('centerControl') centerControl: ElementRef;
  /**To access the native html  div element which hosts add junction control group */
  @ViewChild('bottomRightControl') bottomRightControl: ElementRef;
  @ViewChild('topRightControl') topRightControl: ElementRef;

  /**Stores map object containing various info about map*/
  map: any;
  /**List of all Markers(Junction) that are visible on the map.
   * Stores data related to map functionality and junctions' actual data stored on server as well
   */
  junctionsMarkers: Array<any>;

  /**List of available Junction Types, recieved from server */
  junctionTypes: Array<{ name: string; armCount: number }>;

  /**Holds info of down equipment of current junction */
  downEquipModalInfo = null;


  /** For showing/closing junction configure modal(pop-up) having basic form*/
  showConfigureModal = false;

  /** Holds the marker reference which is opened for either configuration or edition */
  markerBeingConfigured: any;

  newRsuInfo: RSUInfo = {
    name: '',
    ipAddress: '',
    type: null,
    pos: {
      lat: null,
      lng: null
    },
    landmark: ''
  };



  /**Marker to reflect new junction that is added on map */
  newMarker: any;


  /**Holds classes for adding control center: null,*/
  customControlsClass = {
    center: null,
    right: null,
    top: null
  };
  /**Holds the instances created using customControlClass */
  customControls = {
    center: null,
    right: null,
    top: null
  };



  constructor(
    private controlRoomService: ControlRoomService,
    private alertService: AlertService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.initMap();
    this.fetchJunctions();
  }


  /**Creates Map instance initialized with given location and settings */
  initMap() {
    // The center location of map(varanasi)
    const centerLoc = { lat: 25.324144, lng: 82.990081 };

    this.map = L.map(this.mapRef.nativeElement, {
      center: centerLoc,
      zoom: 13
    });

    L.tileLayer(
      `https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${MAPBOX_TOKEN}`,
      {
        attribution:
          // tslint:disable-next-line:max-line-length
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        // id: 'mapbox.streets',
        // id:'mapbox.streets-satellite',
        // id:'mapbox.outdoors'
        id: 'mapbox.light'
      }
    ).addTo(this.map);
    this.intializeControls();
    this.addTopControlsOnMap();
    this.addRightControlsOnMap();
  }

  /**Creates classes for adding controls on map */
  intializeControls() {
    // this.customControlsClass.center = L.Control.extend({
    //   options: {
    //     position: 'bottomleft'
    //     // possible values of control position : 'topleft', 'topright', 'bottomleft', 'bottomright'
    //   },
    //   onAdd: () => {
    //     return this.centerControl.nativeElement;
    //   },
    //   onRemove: () => {
    //     /** do nothing*/
    //   }
    // });

    this.customControlsClass.right = L.Control.extend({
      options: {
        position: 'bottomright'
        // other position options : 'topleft', 'topright', 'bottomleft', 'bottomright'
      },
      onAdd: () => {
        return this.bottomRightControl.nativeElement;
      },
      onRemove: () => {
        /** do nothing*/
      }
    });

    this.customControlsClass.top = L.Control.extend({
      options: {
        position: 'topright'
        // other position options : 'topleft', 'topright', 'bottomleft', 'bottomright'
      },
      onAdd: () => {
        return this.topRightControl.nativeElement;
      },
      onRemove: () => {
        /** do nothing*/
      }
    });
  }


  /**Add controls for filtering juncitions on map by creating instance of @class customControlsClass.center*/
  addCenterControlsOnMap() {
    this.customControls.center = new this.customControlsClass.center();
    this.map.addControl(this.customControls.center);
  }

  /**Add controls for adding juncitions on map by creating instance of @class customControlsClass.right*/
  addRightControlsOnMap() {
    this.customControls.right = new this.customControlsClass.right();
    this.map.addControl(this.customControls.right);
  }

  /**Add controls for help menu on map by creating instance of @class customControlsClass.top*/
  addTopControlsOnMap() {
    this.customControls.top = new this.customControlsClass.top();
    this.map.addControl(this.customControls.top);
  }

  /**Fetch junctions list from server */
  fetchJunctions() {
    this.controlRoomService.getJunctions().subscribe(
      (res: Array<any>) => {
        this.addJunctionsOnMap(res);
        this.addCenterControlsOnMap();
      },
      (err: any) => { }
    );
  }

  /**Displays and stores junctions' data on map */
  addJunctionsOnMap(junctions: Array<any>) {
    this.junctionsMarkers = junctions.map(junc => {
      const marker = this.addMarker(
        { lat: junc.latitude, lng: junc.longitude },
        this.giveIcon(this.giveIconUrl(junc.status), junc.name, junc)
      );

      marker.info = {
        name: junc.name,
        lat: junc.latitude,
        lng: junc.longitude,
        // latDegree: junc.latitudeInDegree,
        // lngDegree: junc.longitudeInDegree,
        // id: junc.id,
        status: junc.status,
        configureStatus: junc.configureStatus,
        type: junc.type,
        armCount: junc.armCount,
        formattedAddress: junc.formattedAddress,
        landmark: junc.landmark || '',
        picName: junc.picName,
        faultyEquipmentCounts: junc.faultyEquipmentCounts,
        /**properties that are only available after addition of equipment count  */
        // mode: junc.mode,
        // communication: junc.communication,
        // detectorCount: junc.detectorCount,
        // slaveCount: junc.slaveCount,
        // poleCount: junc.poleCount,
        // lampCount: junc.lampCount
      };
      return marker;
    });
    this.junctionsMarkers.forEach(m => {
      this.attachClickEventToMarker(m);
      this.setMarkerTooltip(m);
    });
  }



  /**returns the marker icon url according to icon marker status */
  giveIconUrl(status: string) {
    if (MarkerStatus.New_Draggable === status) {
      return MarkerIcon.New_Draggable;
    }
    if (MarkerStatus.Not_Configured === status) {
      return MarkerIcon.Not_Configured;
    }
    if (MarkerStatus.Equipment_Configured === status) {
      return MarkerIcon.Equipment_Configured;
    }
    if (MarkerStatus.Configured === status) {
      return MarkerIcon.Configured;
    }
  }
  dropPinOnMap(formValue: any) {

    // console.log(formValue);
    this.newRsuInfo = formValue;
    this.closeAddRsuModal();
    const mapCenter = this.map.getCenter();
    this.newMarker = this.addMarker(
      mapCenter,
      this.giveIcon(MarkerIcon.New_Draggable, this.newRsuInfo.name),
      true
    );

    this.setMarkerInfo(this.newMarker, {
      name: this.newRsuInfo.name,
      status: MarkerStatus.New_Draggable,
      lat: mapCenter.lat.toFixed(4),
      lng: mapCenter.lng.toFixed(4)
    });
    this.setMarkerTooltip(this.newMarker);
    this.attachClickEventToMarker(this.newMarker);
    this.removeRightControlsFromMap();
    this.setMarkerInfoWindow(this.newMarker, this.newMarker.info);
    this.attachDragEventToMarker(this.newMarker);
  }


  /**Opens Add Junction modal on add junction btn click */
  openAddRSUModal() {
    $('#addRSUModal').modal('show');

  }

  /**Closed add junction modal */
  closeAddRsuModal() {
    $('#addRSUModal').modal('hide');
  }


  /**Returns a new Marker instance to add on map at given position and given icon*/
  addMarker(pos: any, icon: any, draggable = false) {
    return L.marker(pos, {
      // marker options here

      icon: icon,
      draggable: draggable
    }).addTo(this.map);
  }
  /**returns an marker icon instance*/
  giveIcon(iconUrl: string, junctionName: string, junction?: any) {
    const juncId = junction && junction.id;
    // console.log(L.Icon.Default.prototype.options);
    window['onJunctionDownIcon'] =
      window['onJunctionDownIcon'] || this.onJunctionDownIcon.bind(this);
    const html =
      `
      <div class="junction_showcase">
          <img  src="${iconUrl}"/>` +
      // junction && junction.currentStatus === 'active' ? `` :
      (junction && junction.faultyEquipmentCounts > 0
        ? `<span><i onclick='onJunctionDownIcon(event,${juncId})' class="fas fa-exclamation-circle" style="color:#d9534f"></i>
          ${junctionName}</span>
      </div>
      `
        : `<span>${junctionName}</span>`);
    return L.divIcon({
      html: html,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28]
      // shadowSize: [41, 41],
      // shadowAnchor: [22, 94]
    });

    // return L.icon({
    //     iconUrl: iconUrl,
    //     iconSize: [25, 41],
    //     iconAnchor: [12, 41],
    //     popupAnchor: [1, -34],
    //     tooltipAnchor: [16, -28]
    //     // shadowSize: [41, 41],
    //     // shadowAnchor: [22, 94]
    // });
  }

  /**Sets the junctions info property with given info. Info property stores all the junction's information stored on server */
  setMarkerInfo(marker: any, info) {
    marker.info = info;
  }


  onJunctionDownIcon(event: Event, jId: any) {
    console.log('down icon present');

    event.stopPropagation();
    // debugger;
    const marker = this.junctionsMarkers.find(m => m.info.id === jId);
    console.log('infowindow', marker.infoWindow);
    console.log('OPEN', marker.infoWindow && marker.infoWindow.isOpen());

    if (!marker.infoWindow || !marker.infoWindow.isOpen()) {
      const pos = marker.getLatLng();

      const content = '<h6>Loading ...</h6>';
      this.attachInfoWindowToMarker(marker, content);

      this.controlRoomService.getDownEquipentsOfJunction(jId).subscribe(
        res => {
          const junctionInfoWithEquipments = {
            junctionName: marker.info.name,
            lat: marker.info.latDegree,
            lng: marker.info.lngDegree,
            equipments: res
          };
          const c = this.giveDownEquipmentInfoWindowContent(
            junctionInfoWithEquipments
          );
          this.attachInfoWindowToMarker(marker, c);
        },
        err => {
          const c =
            '<p>Some error occured while loading equiment info. Please try again.</p>';
          this.attachInfoWindowToMarker(marker, c);
        }
      );
    }
  }


  /**Sets the junction's tooltip by checking the given marker's status*/
  setMarkerTooltip(marker: any) {
    marker.unbindTooltip();
    switch (marker.info.status) {
      case MarkerStatus.New_Draggable:
        marker.bindTooltip('Click to fix position of marker');
        break;
      case MarkerStatus.Not_Configured:
        if (marker.info.configureStatus === MarkerStatus.Junction_Set) {
          marker.bindTooltip('Click to Configure');
        } else {
          marker.bindTooltip('Click to see info ');
        }
        break;
      default: {
        marker.bindTooltip('Click to see info ');
      }
    }
  }

  /**Opens the pop-up on marker's click and sets its content */
  attachClickEventToMarker(marker: any) {
    marker.addEventListener('click', e => {
      // add infowindow only in case there is not any already opened window with this marker
      if (!marker.infoWindow || !marker.infoWindow.isOpen()) {
        // in case marker is draggable,
        // update marker-info  every time on click in order to show the updated postion of marker
        // if (marker.info.status === MarkerStatus.New_Draggable) {
        //   const pos = marker.getLatLng();
        //   console.log(pos);

        //   this.setMarkerInfo(marker, {
        //     name: marker.info.name,
        //     status: marker.info.status,
        //     lat: pos.latitudeInDegree || Number(pos.lat).toFixed(4),
        //     lng: pos.longitudeInDegree || Number(pos.lng).toFixed(4)
        //   });
        // }
        // else(in case of non-draggable marker), we have already marker.info available
        this.setMarkerInfoWindow(marker, marker.info);
      }
    });
  }

  /**
  * Remove controls for adding juncitions on map by creating instance of @class customControlsClass.right.
  * Needed to hide add button when a new junction is already being added
  */
  removeRightControlsFromMap() {
    this.map.removeControl(this.customControls.right);
  }


  /**Sets the junction's Pop-up window on given marker(junction)*/
  setMarkerInfoWindow(marker: any, info: any) {
    const content = this.getInfoWindowContent(marker, info);
    this.attachInfoWindowToMarker(marker, content);
  }
  /**Drag handler of marker. Used just to remove the pop-up while dragging */
  attachDragEventToMarker(marker: any) {
    marker.addEventListener('dragstart ', e => {
      if (marker.infoWindow.isOpen()) {
        marker.infoWindow.remove();
      }
    });
  }
  /**Updates the icon of marker. Used when status of marker changes */
  updateMarkerIcon(marker: any, iconUrl: string) {
    marker.setIcon(this.giveIcon(iconUrl, marker.info.name));
  }


  /**detaches pop-up from marker */
  detachInfoWindowFromMarker(marker: any) {
    marker.infoWindow.remove();
    marker.infoWindow = null;
  }


  /**Attaches pop-up to marker */
  attachInfoWindowToMarker(marker: any, content: any) {
    // debugger;

    // add new property infoWindow to marker which stores reference of the attached infoWindow
    marker.infoWindow = L.popup({}, marker)
      .setLatLng(marker.getLatLng())
      .setContent(content)
      .openOn(this.map);
  }


  giveDownEquipmentInfoWindowContent(info: any) {
    // console.log(info);

    const div = document.createElement('div');

    const title = document.createElement('h6');
    title.innerText = 'Down Equipments';
    title.style.color = '#d9534f';
    title.style.fontWeight = 'bold';
    title.style.marginBottom = '15px';
    div.appendChild(title);

    const equipmentsWithCount: { equip: string; count: number } = <any>{};
    // fill equipmentsWithCount object with key as equipment Type name and value as its count
    info.equipments.forEach(eq => {
      if (equipmentsWithCount[eq.equipment]) {
        equipmentsWithCount[eq.equipment]++;
      } else {
        equipmentsWithCount[eq.equipment] = 1;
      }
    });

    for (const equip in equipmentsWithCount) {
      if (equipmentsWithCount.hasOwnProperty(equip)) {
        // tslint:disable-next-line:no-shadowed-variable
        const d = document.createElement('div');
        d.style.marginBottom = '10px';
        const name = document.createElement('h6');
        const count = document.createElement('span');
        count.style.color = '#828181';
        count.innerText = ' (' + equipmentsWithCount[equip] + ')';
        name.innerText = equip;
        name.style.fontWeight = 'bold';
        name.style.margin = '0px 5px 0 0';
        name.style.display = 'inline-block';
        name.style.width = 'auto';

        d.appendChild(name);
        d.appendChild(count);
        div.appendChild(d);
      }
    }

    // add view more btn inside a div and then add that div to upper div
    const d = document.createElement('div');
    d.style.textAlign = 'right';
    d.style.marginTop = '15px';
    const btn = document.createElement('button');
    btn.innerText = 'View Detail';
    btn.style.border = 'none';
    btn.style.background = 'none';
    btn.style.cursor = 'pointer';
    btn.addEventListener('click', () => {
      this.downEquipModalInfo = info;
      // settimeout needed bcoz html of modal will be included in DOM
      // in next rendering cycle, so we need to show the modal in next cycle as well
      setTimeout(() => {
        $('#downEqiupModal').modal('show');
      }, 0);
    });
    d.appendChild(btn);

    div.appendChild(d);
    return div;
  }

  /**Prepares and returns the html content of pop-up. Content is prepared depending on marker's status */
  getInfoWindowContent(marker: any, info: any) {
    const div = document.createElement('div');
    div.id = 'newJuncInfoWindow';

    const junctionImg = document.createElement('img');
    junctionImg.className = 'junctionImage';
    junctionImg.src = marker.info.picName
      ? `${BASE_URL}/api/junction/${
      marker.info.id
      }/picture?access_token=${localStorage.getItem('access_token')}`
      : 'assets/img/location-map.png';
    junctionImg.style.maxHeight = '200px';
    div.appendChild(junctionImg);

    const junctionTitle = document.createElement('h6');
    junctionTitle.innerHTML = `${marker.info.name}`;
    div.appendChild(junctionTitle);
    /**formattedAddress will not be available when marker status is: New_Draggable */
    if (info.formattedAddress) {
      const junctionStreet = document.createElement('small');
      junctionStreet.className = 'streetAddress';
      junctionStreet.innerHTML = `${info.formattedAddress}`;
      div.appendChild(junctionStreet);
    }

    const junctionCoordinates = document.createElement('p');
    junctionCoordinates.className = 'coordinates';
    junctionCoordinates.innerHTML = `${info.latDegree || info.lat}, ${info.lngDegree || info.lng}`;
    div.appendChild(junctionCoordinates);

    if (marker.info.status === MarkerStatus.New_Draggable) {
      const msg = document.createElement('div');
      msg.className = 'instructingText';
      msg.innerText = 'Pin the Rsu';
      const btn = document.createElement('button');
      btn.className = 'configureBtn';
      btn.innerText = 'Fix Here';
      btn.addEventListener('click', this.onFixhereBtn.bind(this, marker));

      div.appendChild(msg);
      div.appendChild(btn);
    } else if (
      marker.info.status === MarkerStatus.Not_Configured ||
      marker.info.status === MarkerStatus.Equipment_Configured ||
      marker.info.status === MarkerStatus.Configured
    ) {
      const btn1 = document.createElement('button');
      btn1.className = 'configureBtn';
      btn1.innerText = 'Add camera';
      // btn1.innerText = marker.info.configureStatus === MarkerStatus.Junction_Set ? 'Configure' : 'Configure Equipments';
      btn1.addEventListener('click', this.onConfigureBtn.bind(this, marker));
      div.appendChild(btn1);

      if (marker.info.configureStatus !== MarkerStatus.Junction_Set) {
        const btn2 = document.createElement('button');
        btn2.className = 'configureBtn';
        btn2.innerText = '  Configure  camera';
        btn2.addEventListener('click', this.editBtn.bind(this, marker));
        div.appendChild(btn2);

        // const btn3 = document.createElement('button');
        // btn3.className = 'configureBtn';
        // btn3.innerText = 'Configure RSU';
        // btn3.addEventListener('click', this.configureMasterBtn.bind(this, marker));
        // div.appendChild(btn3);

        // const btn4 = document.createElement('button');
        // btn4.className = 'configureBtn';
        // btn4.innerText = 'Configure Detector';
        // btn4.addEventListener('click', this.configureDetectorBtn.bind(this, marker));
        // div.appendChild(btn4);

        // if (marker.info.status === 'CONFIGURED') {
        //   const btn5 = document.createElement('button');
        //   btn5.className = 'configureBtn';
        //   btn5.innerText = 'View Summary';
        //   btn5.addEventListener('click', this.viewSummaryBtn.bind(this, marker));
        //   div.appendChild(btn5);
        // }
      }
    }

    return div;
  }

  /**Fixes given marker by making it non-draggable */
  fixMarkerPosition(marker: any) {
    marker.dragging.disable();
  }
  /**Handler for fix here btn on new junctions' pop-up. Uploads the junction info to server with current location of marker */
  onFixhereBtn(marker: any) {
    const pos = marker.getLatLng();

    // update pos in newRsuInfo
    this.newRsuInfo.pos.lat = pos.lat;
    this.newRsuInfo.pos.lng = pos.lng;
    this.fetchJunctionAddress(pos.lat, pos.lng).then((frmtdAddress: string) => {
      this.uploadNewJunctionInfo(frmtdAddress)
        .then((newInfo: any) => {
          this.fixMarkerPosition(marker);

          this.setMarkerInfo(this.newMarker, {
            name: this.newRsuInfo.name,
            status: MarkerStatus.Not_Configured,
            configureStatus: newInfo.configureStatus,
            lat: pos.lat.toFixed(4),
            lng: pos.lng.toFixed(4),
            id: newInfo.id,
            type: { name: newInfo.type, armCount: newInfo.armCount },
            landmark: this.newRsuInfo.landmark,
            formattedAddress: frmtdAddress
          });
          this.setMarkerTooltip(marker);

          this.updateMarkerIcon(marker, MarkerIcon.Not_Configured);

          this.detachInfoWindowFromMarker(marker);

          const content = this.getInfoWindowContent(marker, {
            name: this.newRsuInfo.name,
            lat: pos.lat.toFixed(4),
            lng: pos.lng.toFixed(4)
          });
          this.attachInfoWindowToMarker(marker, content);
          this.addRightControlsOnMap();
          this.resetNewJunctionInfo();
        })
        .catch(() => {
          /** do nothing here */
        });
    });
  }

  /**Fetches the junction address using position(lng,lat) */
  fetchJunctionAddress(lat: number, lng: number) {
    return new Promise((res, rej) => {
      this.alertService.showLoader('Fetching Location Address ...');
      this.controlRoomService.getJunctionAddress(lat, lng).subscribe(
        (add: any) => {
          this.alertService.closeLoader();
          setTimeout(() => {
            res(add);
          }, 500);
        },
        err => {
          this.alertService.closeLoader();
          setTimeout(() => {
            res('');
          }, 500);
        }
      );
    });
  }
  // JUNCTION CONFIG-STARTS

  /**Click handler for configure button on marker's pop-up. Opens Junction Configure modal */
  onConfigureBtn(marker: any) {
    // close the infoWindow on configure btn and open modal
    if (marker.infoWindow.isOpen()) {
      marker.infoWindow.remove();
    }
    this.markerBeingConfigured = marker;

    this.showConfigureModal = true;
  }

  /**Click handler for configure button on marker's pop-up. Opens Junction Configure modal */
  onConfigureEquipBtn(marker: any) {
    // close the infoWindow on configure btn and open modal
    if (marker.infoWindow.isOpen()) {
      marker.infoWindow.remove();
    }
    this.markerBeingConfigured = marker;
    // this.showConfigureDetailModal = true;
  }

  /**Click handler for configure detector button on markers' pop-up. Naviagates to Master interface */
  configureDetectorBtn(marker: any) {
    this.router.navigate(['/detector', marker.info.id]);
  }

  /**Click handler for view summary button on markers' pop-up. Naviagates to Master interface */
  viewSummaryBtn(marker: any) {
    this.router.navigate(['/master', marker.info.id, 'summary-detailed'], { queryParams: { withDetector: true } });
  }
  /**Click handler for edit btn on markers' pop-up. Opens Junctions' edit modal */
  editBtn(marker: any) {
    // close the infoWindow on edit btn and open modal
    if (marker.infoWindow.isOpen()) {
      marker.infoWindow.remove();
    }
    // here it represents markerBeingEdited
    this.markerBeingConfigured = marker;
    // this.showConfigureEditModal = true;
  }
  /**Upload the added junction to server and show success/erro messages. */
  uploadNewJunctionInfo(frmtdAddress: string) {
    return new Promise((resolve, reject) => {
      const payLoad = {
        name: this.newRsuInfo.name,
        longitude: this.newRsuInfo.pos.lng,
        latitude: this.newRsuInfo.pos.lat,
        type: this.newRsuInfo.type.name,
        armCount: this.newRsuInfo.type.armCount,
        landmark: this.newRsuInfo.landmark,
        formattedAddress: frmtdAddress,
        ipAddress: this.newRsuInfo.ipAddress
      };

      const request = this.controlRoomService.addJunction(payLoad);

      this.alertService
        .confirmWithLoader(
          request,
          'info',
          '',
          'Junction information will be saved. Do You want to continue ?',
          'Save',
          '#28a745'
        )
        .then(res => {
          // console.log(res);
          if (res.value) {
            this.alertService.showSuccessAlert('Junction saved successfully.');
            resolve(res.value);
          } else {
            reject();
          }
        })
        .catch((err: any) => {
          this.alertService.showErrorAlert(err.msg);
          reject(err);
        });
    });
  }
  configureMasterBtn(marker: any) {
    this.router.navigate(['/master', marker.info.id]);
  }



  /**Resets @property newRsuInfo */
  resetNewJunctionInfo() {
    this.newRsuInfo.name = '';
    this.newRsuInfo.type = this.junctionTypes[0];
    this.newRsuInfo.pos.lat = null;
    this.newRsuInfo.pos.lng = null;
    this.newRsuInfo.landmark = '';
  }
}

