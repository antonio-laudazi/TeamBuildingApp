import { Component, OnInit } from '@angular/core';
import { LocalNotifications, ELocalNotificationTriggerUnit } from '@ionic-native/local-notifications/ngx';
import { AlertController, Platform, LoadingController, NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { StoreService } from '../../services/services.store';
import { FileService } from '../../services/services.file';
import { Modello } from '../../models/gruppo.namespace';
import { JsonResponse } from '../../models/json.namespace';

@Component({
  selector: 'app-gruppi',
  templateUrl: 'gruppi.page.html',
  styleUrls: ['gruppi.page.scss'],
})

export class GruppiPage implements OnInit {
  private gruppi: Array<Modello.Gruppo>;
  private domandeTemporizzate: Array<Modello.DomandaTemporizzata>;
  private tappe: Array<Modello.Tappa>;

  constructor(
    private plt: Platform,
    private localNotifications: LocalNotifications,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private storeService: StoreService,
    private fileService: FileService,
    private navCtr: NavController,
    private http: HttpClient) {

  }

  ngOnInit() {

    this.fileService.getGruppi().subscribe(res => {
      this.gruppi = res;
    });

    this.fileService.getDomandeTemporizzate().subscribe(res => {
      this.domandeTemporizzate = res;
    });

    this.plt.ready().then(() => {
      this.localNotifications.on('click').subscribe(res => {
        let msg = res.data ? res.data.mydata : '';
        this.showAlert(res.text, msg);
      });

      this.localNotifications.on('trigger').subscribe(res => {
        let msg = res.data ? res.data.mydata : '';
        this.showAlert(res.text, msg);
      });
    });
  }

  private scheduleNotification() {
    this.localNotifications.schedule({
      id: 1,
      title: 'Attention',
      text: 'Simons Notification',
      data: { mydata: 'My hidden message this is' },
      trigger: { in: 5, unit: ELocalNotificationTriggerUnit.SECOND },
      foreground: true // Show the notification while app is open
    });
  }

  public showAlert(sub, msg) {
    var domandaTempCodice: number;
    this.storeService.getLastDomandaTemporizzata().then((codiceD) => {
      if (codiceD !== undefined) {
        domandaTempCodice = codiceD + 1;
      } else {
        domandaTempCodice = 1;
      }
    });
    var domandaTemp: Modello.DomandaTemporizzata = this.domandeTemporizzate.filter((d) => {
      return d.codice === domandaTempCodice;
    })[0];
    var inputsDomande: Array<{
      name: string,
      value: number
    }> = new Array();
    for (let index = 0; index < domandaTemp.risposte.length; index++) {
      const risposta = domandaTemp.risposte[index];
      inputsDomande.push({ name: risposta.testo, value: risposta.codice });
    }
    this.alertCtrl.create({
      subHeader: sub,
      message: msg,
      inputs: inputsDomande,
      buttons: [{
        text: 'Rispondi',
        handler: () => {
          console.log('rispondi pressed');
        }
      }],
      backdropDismiss: false
    }).then(alert => alert.present());
  }

  public saveGruppoScelto(gruppo: Modello.Gruppo) {
    this.storeService.clear();
    this.scheduleNotification();
    this.storeService.saveGruppoScelto(gruppo);

    // recupero le domande del gruppo e le metto in storage
    this.fileService.getTappe(gruppo.tappe).subscribe(res => {
      this.storeService.saveTappeScelte(res);
      this.navCtr.navigateRoot('/list');// vado alla pagina successiva solo quando ho salvato in storage le tappe relative al gruppo scelto
    });
  }
}
