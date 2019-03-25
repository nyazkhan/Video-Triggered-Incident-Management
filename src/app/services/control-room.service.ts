/**
 * @description
 * This contains methods and requests related to control-room interface
 */
import { Injectable } from '@angular/core';
import { CustomHttpService } from './custom-http.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { retry } from 'rxjs/operators';
import { MAPBOX_TOKEN } from './app.constants';

/**
 * @description
 * This contains methods and requests related to control-room interface
 */
@Injectable()
export class ControlRoomService {

    junctionTypes: Array<{ name: string, armCount: number }>; // stores after first fetching from server
    modes: Array<string>;
    poleType: Array<any>;

    constructor(
        private http: CustomHttpService,
        private httpClient: HttpClient,
    ) { }

    /**Fetches the junction types from the server first time and then saves them for later use */
    getJunctionTypes() {
        if (this.junctionTypes) {
            return of(this.junctionTypes);
        }
        return this.http.get('/api/junction-type')
            .map((res: Array<{ name: string, armCount: number }>) => {
                this.junctionTypes = res;
                return res;
            });
    }

    addJunction(junctionData: any) {
        return this.http.post('/api/junction', junctionData);
    }

    getJunctions() {
        return this.http.get('/api/junction').pipe(retry(1));
    }

    getJunctionById(id: number) {
        return this.http.get(`/api/junction/${id}`);
    }

    getJunctionAddress(lat: number, lng: number) {

        return this.httpClient.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}`)
            .map((result: any) => {
                console.log(result);

                if (result.features && result.features.length) {
                    return result.features[0].place_name;
                } else {
                    return '';
                }
            });

    }

    /**METHODS RELATED TO JUNCTION CONFIGURATION */

    getModes() {
        if (this.modes) {
            return of(this.modes);
        }
        return this.http.get('/api/mode')
            .map((res: Array<string>) => {
                this.modes = res;
                return res;
            });
    }

    submitJunctionEquipmentConfiguration(data: any, juncId: number) {
        return this.http.put(`/api/junction/${juncId}`, data);
    }

    /**METHODS RELATED TO JUNCTION EQUIPMENT CONFIGURATION */

    saveEquipmentInfo(equipment: string, juncId: number, data: any) {
        const api = `/api/junction/${juncId}/${equipment}`;
        return this.http.post(api, data);
    }

    getEquipmentInfo(equipment: string, juncId: number) {
        const api = `/api/junction/${juncId}/${equipment}`;
        return this.http.get(api);
    }

    getPoleTypes() {
        if (this.poleType) {
            return of(this.poleType);
        }
        return this.http.get('/api/pole-type')
            .map((res: Array<string>) => {
                this.poleType = res;
                return res;
            });
    }

    getLampLights() {
        return this.http.get(`/api/light`);
    }


    /**METHODS RELATED TO JUNCTION EQUIPMENT CONFIGURATION EDITION */

    // -------------- EDIT DETAILS----------------
    /**for master */
    editMasterInfo(juncId: number, data: any) {
        const api = `/api/junction/${juncId}/master`;
        return this.http.put(api, data);
    }
    /**for  equipments other than master and lamp (for lamp same url as in case of adding lamps is used)*/
    // editEquipmentInfo(equipment: string, equipmentId: number, data: any) {
    //     const api = `/api/junction/${equipment}/${equipmentId}`;
    //     return this.http.put(api, data);
    // }

    /**for  equipments other than master and lamp (for lamp same url as in case of adding lamps is used)*/
    editEquipmentInfo(jId: number, equipment: string, data: any) {
        const api = `/api/junction/${jId}/${equipment}`;
        return this.http.put(api, data);
    }

    // -------------- DELETE EQUIPMENT----------------
    /**only equipments other than master can be deleted*/
    deleteEquipmentInfo(equipment: string, equipmentId: number) {
        const api = `/api/${equipment}/${equipmentId}`;
        return this.http.delete(api);
    }

    /**only equipments other than master can be deleted*/
    reactivateEquipmentInfo(equipment: string, equipmentId: number) {
        const api = `/api/${equipment}/${equipmentId}/activate`;
        return this.http.put(api, {});
    }

    // -------------- ADD EQUIPMENT----------------
    /**only equipments other than master can be added*/
    addEquipmentInfo(juncId: number, equipment: string, data: any) {
        const api = `/api/junction/${juncId}/${equipment}`;
        return this.http.post(api, data);
    }

    getDownEquipentsOfJunction(jId: number) {
        return this.http.get(`/api/junction/${jId}/equipment-state/0`, undefined, false);
    }




}
