
import { Injectable } from '@angular/core';
import { Modello } from '../models/gruppo.namespace';
import { HttpClient } from '@angular/common/http';
import { Observable, Observer } from 'rxjs';
import { JsonResponse } from '../models/json.namespace';

@Injectable()
export class FileService {

    constructor(private http: HttpClient) {
    }

    public getGruppi() {
        return new Observable((observer: Observer<Array<Modello.Gruppo>>) => {
            this.http.get('assets/data.json').subscribe(res => {
                observer.next((res as JsonResponse).gruppi);
              });
        });
    }

    public getDomandeTemporizzate() {
        return new Observable((observer: Observer<Array<Modello.DomandaTemporizzata>>) => {
            this.http.get('assets/data.json').subscribe(res => {
                observer.next((res as JsonResponse).domandetemporizzate);
              });
        });
    }

    public getTappe(codiciTappa: Array<string>) {
        return new Observable((observer: Observer<Array<Modello.Tappa>>) => {
            this.http.get('assets/data.json').subscribe(res => {
                let tappe = (res as JsonResponse).tappe;
                let tappeScelte = new Array<Modello.Tappa>();

                for (let codiceTappa of codiciTappa){
                    for (let tappa of tappe) {
                        if(tappa.codice === codiceTappa) {
                            tappeScelte.push(tappa);
                        }
                    }
                }
                observer.next(tappeScelte);
              });
        });
    }
}
