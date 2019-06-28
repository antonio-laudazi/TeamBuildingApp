import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Modello } from '../../models/gruppo.namespace';
import { StoreService } from '../../services/services.store';

@Component({
  selector: 'app-tappa',
  templateUrl: 'tappa.page.html',
  styleUrls: ['tappa.page.scss'],
})

export class TappaPage implements OnInit {
  public tappaSelezionata: Modello.Tappa;
  private rispostaSelezionata: Modello.Risposta;

  constructor(
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private storeService: StoreService,
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


  public openMap() {
    const geocoords = this.tappaSelezionata.coordinatex + ',' + this.tappaSelezionata.coordinatey;
    window.open('geo:lat,lon?q=' + geocoords + '(' + encodeURI(this.tappaSelezionata.nome) + ')', '_system');
  }

  public finePausa(){
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
        this.showAlert('', 'Risposta è corretta!!!', '');
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
      message: 'Hellooo',
      duration: 10000
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
}
