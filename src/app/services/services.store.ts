import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { Modello } from '../models/gruppo.namespace';

@Injectable()
export class StoreService {

    constructor(
        private storage: Storage) {
    }

    /* public getParoleIndovinate(): Array<string> {
         var items: Array<string> = [];
         console.log("getParoleIndovinate");
         for (let i = 1; i < 15; i++) {
             items.push('Item ' + i);
         }
         return items;
     }*/

    public saveGruppoScelto(gruppo: Modello.Gruppo) {
        console.log(gruppo);
        this.storage.set('gruppoScelto', JSON.stringify(gruppo));
    }

    public async getGruppoScelto(): Promise<string> {
        return await this.storage.get('gruppoScelto');
    }

    public async getTappeScelte(): Promise<string> {
        return await this.storage.get('tappeScelte');
    }

    public saveTappeScelte(tappe: Array<Modello.Tappa>) {
        this.storage.set('tappeScelte', JSON.stringify(tappe));
    }

    public saveTappaAbilitata(gruppo: Modello.Gruppo) {
        console.log('saveGruppoScelto');
        this.storage.set('gruppoScelto', JSON.stringify(gruppo));
    }

    public saveTappaCompletata(tappaCompletata: Modello.Tappa) {
        console.log('saveTappaCompletata');
        this.getTappeScelte().then((tappeScelteString) => {
            const tappeScelte: Array<Modello.Tappa> = JSON.parse(tappeScelteString);
            const tappa: Modello.Tappa = tappeScelte.filter((t) => {
                return t.codice === tappaCompletata.codice;
            })[0];
            tappa.completata = 1;
            this.saveTappeScelte(tappeScelte);
        });
    }

    public savePunteggio(punteggio: number) {
        this.storage.set('punteggio', punteggio);
    }

    public async getPunteggio(): Promise<number> {
        return await this.storage.get('punteggio');
    }

    public saveLastDomandaTemporizzata(codiceDomanda: number) {
        this.storage.set('codiceDomanda', codiceDomanda);
    }

    public async getLastDomandaTemporizzata(): Promise<number> {
        return await this.storage.get('codiceDomanda');
    }

    public saveDomandeTemporizzate(domande: string) {
        this.storage.set('domandeTemporizzate', domande);
    }

    public async getDomandeTemporizzate(): Promise<string> {
        return await this.storage.get('domandeTemporizzate');
    }

    public salvaCondizioniAccettate(): void{
        this.storage.set('condizioniAccettate', 'true');
    }

    public async controllaCondizioniAccettate(): Promise<boolean> {
        return await this.storage.get('condizioniAccettate') === 'true';
    }

    public clear() {
        this.storage.clear().then(() => {
            console.log('all keys cleared');
        });
    }

}
