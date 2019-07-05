import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { Modello } from '../models/gruppo.namespace';
import { StoreService } from '../services/services.store';

@Injectable()
export class DomandeTemporizzateService {

    private intervalloDomande: number;
    private indiceDomanda: number;
    private maxIndiceDomanda: number;

    private domande: Array<Modello.DomandaTemporizzata>;

    private idIntervallo;

    public timerScattatoSubject: Subject<boolean> = new Subject<boolean>();
    public timerScattato = this.timerScattatoSubject.asObservable();

    public punteggioVariatoSubject: Subject<number> = new Subject<number>();
    public punteggioVariato = this.punteggioVariatoSubject.asObservable();

    constructor(public alertCtrl: AlertController,
                public storeService: StoreService) {
        this.intervalloDomande = 60000;
        this.storeService.getProssimaDomandaTemporizzata().then(data => {
            if (data !== null && data !== undefined) {
                this.indiceDomanda = data;
            } else {
                this.indiceDomanda = 0;
            }
            this.storeService.saveProssimaDomandaTemporizzata(0);
        });
        this.maxIndiceDomanda = 12;
    }

    public async startTimer() {
        this.idIntervallo = setInterval(() => this.timerScattatoSubject.next(true), this.intervalloDomande);
    }

    public async openRadioAlert(domandaTemporizzata: Modello.DomandaTemporizzata) {

        let risposto = false;
        const tempoScaduto = await this.alertCtrl.create({
            header: 'TEMPO SCADUTO!',
            buttons: [
                {
                    text: 'ESCI'
                }
            ]
        });
        const alertDomanda = await this.alertCtrl.create({
            header: domandaTemporizzata.testo,
            inputs: [
                {
                    type: 'radio',
                    label: domandaTemporizzata.risposte[0].testo,
                    value: domandaTemporizzata.risposte[0].codice
                },
                {
                    type: 'radio',
                    label: domandaTemporizzata.risposte[1].testo,
                    value: domandaTemporizzata.risposte[1].codice
                },
                {
                    type: 'radio',
                    label: domandaTemporizzata.risposte[2].testo,
                    value: domandaTemporizzata.risposte[2].codice
                },
            ],
            buttons: [
                {
                    text: 'INVIA',
                    handler: data => {
                        risposto = true;
                        console.log('risposta alla domanda ' + this.indiceDomanda + ': ' + data);
                        if (this.indiceDomanda === this.maxIndiceDomanda) {
                            clearInterval(this.idIntervallo);
                            this.resettaIndice();
                        } else {
                            // controllo se ho risposto bene
                            if (data === domandaTemporizzata.codicerisposta) {
                                // risposta corretta
                                this.aumentaPunteggio();
                                this.showAlert('', 'RISPOSTA ESATTA! HAI GUADAGNATO 1 PUNTO', '');
                            } else {
                                // risposta errata
                                this.showAlert('', 'RISPOSTA SBAGLIATA!', '');
                            }
                        }
                    }
                }
            ]
        });
        await alertDomanda.present();
        setTimeout(() => {
            if (!risposto) {
                alertDomanda.dismiss();
                tempoScaduto.present();
                setTimeout(() => {
                    tempoScaduto.dismiss();
                }, 5000);
            }
        }, 15000);
    }

    public showAlert(header, sub, msg) {
        this.alertCtrl.create({
          subHeader: sub,
          message: msg,
          buttons: ['Ok']
        }).then(alert => alert.present());
    }

    public getProssimaDomanda(domande: Array<Modello.DomandaTemporizzata>): Modello.DomandaTemporizzata {
        if (this.indiceDomanda === this.maxIndiceDomanda) {
            return null;
        }
        const domanda = domande[this.indiceDomanda];
        this.aumentaIndice();
        return domanda;
    }

    public aumentaPunteggio(): void {
        this.storeService.getPunteggio().then(data => {
            let punteggio = data;
            punteggio++;
            this.storeService.savePunteggio(punteggio);
            this.punteggioVariatoSubject.next(punteggio);
        });
    }

    public resettaPunteggio(): void {
        this.storeService.savePunteggio(0);
        this.punteggioVariatoSubject.next(0);
    }

    public resettaTimer(): void {
        clearInterval(this.idIntervallo);
        this.idIntervallo = false;
    }

    public isTimerRunning(): boolean {
        return (this.idIntervallo !== false && this.idIntervallo !== undefined);
    }

    public getIndiceDomanda(): number {
        return this.indiceDomanda;
    }

    public aumentaIndice(): void {
        this.indiceDomanda++;
        this.storeService.saveProssimaDomandaTemporizzata(this.indiceDomanda);
    }

    public resettaIndice(): void {
        this.indiceDomanda = 0;
        this.storeService.saveProssimaDomandaTemporizzata(0);
    }
}