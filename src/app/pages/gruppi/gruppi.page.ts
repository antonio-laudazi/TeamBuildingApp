import { Component, OnInit } from '@angular/core';
import { LocalNotifications, ELocalNotificationTriggerUnit } from '@ionic-native/local-notifications/ngx';
import { AlertController, Platform, LoadingController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { StoreService } from '../../services/services.store';
import { FileService } from '../../services/services.file';
import { DomandeTemporizzateService } from '../../services/services.domandeTemporizzate';
import { Modello } from '../../models/gruppo.namespace';

@Component({
  selector: 'app-gruppi',
  templateUrl: 'gruppi.page.html',
  styleUrls: ['gruppi.page.scss'],
})

export class GruppiPage implements OnInit {
  public gruppi: Array<Modello.Gruppo>;
  private domandeTemporizzate: Array<Modello.DomandaTemporizzata>;
  private tappe: Array<Modello.Tappa>;

  private intervalloDomande = 20000;
  private indiceDomanda = 0;
  private maxIndiceDomanda = 12;
  private idIntervallo;

  constructor(
    private plt: Platform,
    private localNotifications: LocalNotifications,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private storeService: StoreService,
    private fileService: FileService,
    private domandeTemporizzateService: DomandeTemporizzateService,
    private navCtr: NavController,
    private http: HttpClient,
    private router: Router) {

  }

  ngOnInit() {

    this.fileService.getGruppi().subscribe(res => {
      this.gruppi = res;
    });
  }

  // private scheduleNotification() {
  //   this.localNotifications.schedule({
  //     id: 1,
  //     title: 'Attention',
  //     text: 'Simons Notification',
  //     data: { mydata: 'My hidden message this is' },
  //     trigger: { in: 5, unit: ELocalNotificationTriggerUnit.SECOND },
  //     foreground: true // Show the notification while app is open
  //   });
  // }


  // public saveGruppoScelto(gruppo: Modello.Gruppo) {

  //   this.storeService.clear();
  //   this.storeService.salvaCondizioniAccettate();
  //   this.scheduleNotification();
  //   this.storeService.saveGruppoScelto(gruppo);

  //   // this.idIntervallo = setInterval(() => this.openRadioAlert(this.domandeTemporizzate[this.indiceDomanda]), this.intervalloDomande);
  //   // quando scelgo un gruppo deve partire il percorso delle domande temporizzate.

  //   // recupero le domande del gruppo e le metto in storage
  //   this.fileService.getTappe(gruppo.tappe).subscribe(res => {
  //     this.storeService.saveTappeScelte(res);
  //     this.navCtr.navigateRoot('/list'); // vado alla pagina successiva solo quando ho salvato in storage le tappe relative al gruppo scelto
  //   });
  // }

  async presentAlertConfirm(gruppo) { // quando cambio il gruppo devo avvertire delle conseguenze
    const alert = await this.alertCtrl.create({
      header: 'Cambio Gruppo',
      message: 'Cambiare il gruppo azzererà il percorso fatto fino ad adesso. Continuare?',
      buttons: [
        {
          text: 'NO',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'SI',
          handler: () => {
            this.storeService.clear();
            this.storeService.salvaCondizioniAccettate();
            // this.scheduleNotification();
            this.storeService.saveGruppoScelto(gruppo);

            this.domandeTemporizzateService.resettaIndice();
            this.domandeTemporizzateService.resettaPunteggio();
            this.domandeTemporizzateService.resettaTimer();

            this.domandeTemporizzateService.startTimer();

            // recupero le domande del gruppo e le metto in storage
            this.fileService.getTappe(gruppo.tappe).subscribe(res => {
              this.storeService.saveTappeScelte(res);
              // vado alla pagina successiva solo quando ho salvato in storage le tappe relative al gruppo scelto
              this.navCtr.navigateRoot('/list');
            });
          }
        }
      ]
    });

    await alert.present();
  }
}
