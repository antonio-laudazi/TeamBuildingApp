import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { Modello } from '../models/gruppo.namespace';

@Injectable()
export class DomandeTemporizzateService {

    private punteggio: number;
    private intervalloDomande: number;
    private indiceDomanda: number;
    private maxIndiceDomanda: number;

    private domande: Array<Modello.DomandaTemporizzata>;

    private idIntervallo;

    public timerScattatoSubject: Subject<boolean> = new Subject<boolean>();
    public timerScattato = this.timerScattatoSubject.asObservable();

    public punteggioVariatoSubject: Subject<number> = new Subject<number>();
    public punteggioVariato = this.punteggioVariatoSubject.asObservable();

    constructor(public alertCtrl: AlertController) {
        this.punteggio = 0;
        this.intervalloDomande = 15000;
        this.indiceDomanda = 0;
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
                                alert('RISPOSTA CORRETTA!');
                            } else {
                                // risposta errata
                                alert('RISPOSTA ERRATA!');
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
            }
        }, 3000);
    }

    public getProssimaDomanda(domande: Array<Modello.DomandaTemporizzata>): Modello.DomandaTemporizzata {
        if (this.indiceDomanda === this.maxIndiceDomanda) {
            return null;
        }
        const domanda = domande[this.getIndiceDomanda()];
        this.aumentaIndice();
        return domanda;
    }

    public getPunteggio(): number {
        return this.punteggio;
    }

    public aumentaPunteggio(): void {
        this.punteggio++;
        this.punteggioVariatoSubject.next(this.punteggio);
    }

    public resettaPunteggio(): void {
        this.punteggio = 0;
        this.punteggioVariatoSubject.next(this.punteggio);
    }

    public resettaTimer(): void {
        clearInterval(this.idIntervallo);
    }

    public getIndiceDomanda(): number {
        return this.indiceDomanda;
    }

    public aumentaIndice(): void {
        this.indiceDomanda++;
    }

    public resettaIndice(): void {
        this.indiceDomanda = 0;
    }
}