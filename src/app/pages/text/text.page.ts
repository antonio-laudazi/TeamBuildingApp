import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../services/services.store';

import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-text',
  templateUrl: './text.page.html',
  styleUrls: ['./text.page.scss'],
})
export class TextPage implements OnInit {

  constructor(private storeService: StoreService,
              private navCtr: NavController) {
              }

  ngOnInit() {
  }

  public accettaCondizioni(): void {
    // salvo nello storage che ho accettato le condizioni
    this.storeService.salvaCondizioniAccettate();

    // vado alla pagina dei gruppi oppure delle tappe (controllo per scrupolo
    // se il gruppo è già stato scelto. In teoria non dovrebbe essere cosi')
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
  }
}
