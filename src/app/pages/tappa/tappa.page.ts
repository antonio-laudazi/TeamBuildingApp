import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Modello } from '../../models/gruppo.namespace';
import { StoreService } from '../../services/services.store';
import { FileService } from '../../services/services.file';
import { DomandeTemporizzateService } from '../../services/services.domandeTemporizzate';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-tappa',
    templateUrl: 'tappa.page.html',
    styleUrls: ['tappa.page.scss'],
})

export class TappaPage implements OnInit {

    private unsubscribe: Subject<boolean> = new Subject<boolean>();
    public tappaSelezionata: Modello.Tappa;
    private rispostaSelezionata: Modello.Risposta;
    private domandeTemporizzate;

    constructor(
        private alertCtrl: AlertController,
        private loadingCtrl: LoadingController,
        private storeService: StoreService,
        private domandeTemporizzateService: DomandeTemporizzateService,
        private fileService: FileService,
        private route: ActivatedRoute,
        private navCtr: NavController,
        private router: Router) {
        this.route.queryParams.subscribe(params => {
            if (this.router.getCurrentNavigation().extras.state) {
                this.tappaSelezionata = this.router.getCurrentNavigation().extras.state.tappaSelezionata;
            }
        });
    }

    ngOnInit() {
    }

    public rispostaChecked(risposta) {
        this.rispostaSelezionata = risposta;
        console.log(this.rispostaSelezionata);
    }

    public goBack() {
        this.router.navigate(['list'], {});
    }

    public openMap() {
        const geocoords = this.tappaSelezionata.coordinatex + ',' + this.tappaSelezionata.coordinatey;
        window.open('geo:lat,lon?q=' + geocoords + '(' + encodeURI(this.tappaSelezionata.nome) + ')', '_system');
    }

    public finePausa() {
        this.tappaSelezionata.completata = 1;
        this.storeService.saveTappaCompletata(this.tappaSelezionata);
        this.showAlert('', 'Pausa Finita, riprendiamo il percorso!!!', '');
        this.navCtr.back();
    }

    public salvaRisposta() {
        if (this.rispostaSelezionata !== undefined) {
            const codiceRipostaCorretta = this.tappaSelezionata.domanda.rispostavalida;
            if (codiceRipostaCorretta === this.rispostaSelezionata.codice) {
                this.tappaSelezionata.completata = 1;
                this.storeService.saveTappaCompletata(this.tappaSelezionata);
                this.showAlert('', 'Bravi, avete dato la risposta esatta e sbloccato la prossima destinazione!', '');
                this.navCtr.back();
            } else {
                this.showLoader();
            }
        } else {
            this.showAlert('', 'Devi selezionare almeno una risposta.', '');
        }
    }

    public async showLoader() {
        const loading = await this.loadingCtrl.create({
            cssClass: 'custom-loader',
            message: 'La risposta non è corretta.<br>Avete <b>2 minuti</b> di penalità prima di poter rispondere alla prossima domanda.',
            spinner: null,
            duration: 120000
        });
        await loading.present();
    }

    public showAlert(header, sub, msg) {
        this.alertCtrl.create({
            subHeader: sub,
            message: msg,
            buttons: ['Ok']
        }).then(alert => alert.present());
    }

    ionViewDidEnter() {
        this.fileService.getDomandeTemporizzate().subscribe(res => {
            this.domandeTemporizzate = res;
            if (this.domandeTemporizzate !== undefined) {
                this.domandeTemporizzateService.timerScattato.pipe(takeUntil(this.unsubscribe)).subscribe(r => {
                    const prossimaDomanda = this.domandeTemporizzateService.getProssimaDomanda(this.domandeTemporizzate);
                    if (prossimaDomanda != null) {
                        this.domandeTemporizzateService.openRadioAlert(prossimaDomanda);
                    }
                });
            }
        });
    }

    ionViewDidLeave() {
        this.unsubscribe.next(true);
        this.unsubscribe.unsubscribe();
    }
}
