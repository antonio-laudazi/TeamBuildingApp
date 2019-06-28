import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../services/services.store';
import { Modello } from '../../models/gruppo.namespace';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
  public punteggio: number;

  public elencoTappe: Array<Modello.Tappa>;

  constructor(
    private storeService: StoreService,
    private router: Router) {

    }

  ngOnInit() {
    this.storeService.getTappeScelte().then((tappeScelteString) => {
      this.elencoTappe = JSON.parse(tappeScelteString);
    });
    this.storeService.getPunteggio().then((punteggio) => {
      if (punteggio) {
        this.punteggio = punteggio;
      } else {
        this.punteggio = 0;
      }
    });
  }

  public goToTappa(tappa) {
    console.log('goToTappa');
    if (tappa.abilitata === 1 && !(tappa.completata === 1) && this.getCodiceProssima() === tappa.codice) {
      const navigationExtras: NavigationExtras = {
        state: {
          tappaSelezionata: tappa
        }
      };
      this.router.navigate(['tappa'], navigationExtras);
    }
  }

  public getCodiceProssima() {
    for (let tappa of this.elencoTappe) {
      if (tappa.completata === 0 && tappa.abilitata === 1) {
        return tappa.codice;
      }
    }
  }

  public disabilitaTappa(tappa) {
    tappa.abilitata = 0;
    this.storeService.saveTappeScelte(this.elencoTappe);
  }

  public abilitaTappa(tappa) {
    tappa.abilitata = 1;
    this.storeService.saveTappeScelte(this.elencoTappe);
  }

}
