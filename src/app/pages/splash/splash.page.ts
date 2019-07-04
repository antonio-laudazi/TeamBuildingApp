import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { StoreService } from '../../services/services.store';

@Component({
    selector: 'app-splash',
    templateUrl: './splash.page.html',
    styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {

    public splashScreenimagePath: string;

    constructor(private navCtr: NavController,
        private storeService: StoreService) {
        this.splashScreenimagePath = 'assets/img/splash/American_Express_logo.jpg';
    }

    ngOnInit() {
        // this.storeService.clear(); // da togliere quando sono finiti i test
        // aspetto 5 secondi e poi vado al disclaimer oppure ai gruppi oppure alle tappe
        setTimeout(() => {
            this.storeService.controllaCondizioniAccettate().then((accettate) => {
                if (accettate) {
                    // controllo anche che sia già stato scelto il gruppo oppure no
                    this.storeService.getGruppoScelto().then((gruppo) => {
                        if (gruppo) { // il gruppo è stato salvato in precendenza ed è presente nello storage
                            // vado alla lista delle tappe
                            // devo caricare le tappe?
                            this.navCtr.navigateRoot('/list');
                        } else {
                            // vado alla lista dei gruppi
                            this.navCtr.navigateRoot('/gruppi');
                        }

                    });
                } else {
                    // se le condizioni non sono state accettate allora vado alla pagina per accettarle
                    this.navCtr.navigateRoot('/text');
                }
            });
        }, 10000);
    }

}
