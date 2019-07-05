import { Component, OnInit, OnDestroy } from '@angular/core';
import { StoreService } from '../../services/services.store';
import { Modello } from '../../models/gruppo.namespace';
import { NavigationExtras, Router } from '@angular/router';
import { DomandeTemporizzateService } from '../../services/services.domandeTemporizzate';
import { FileService } from '../../services/services.file';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit, OnDestroy {

  private unsubscribe: Subject<boolean> = new Subject<boolean>();
  public punteggio: number;
  public elencoTappe: Array<Modello.Tappa>;
  private domandeTemporizzate;
  private subscription; 

  private sottoscritto = false;

  constructor(
    private storeService: StoreService,
    private domandeTemporizzateService: DomandeTemporizzateService,
    private fileService: FileService,
    private router: Router) {
      this.storeService.getPunteggio().then(data => {
        this.punteggio = data;
      });
    }

  ngOnInit() {

    // se apro la app e vengo mandato direttamente sulla lista delle tappe devo far partire il timer
    if(!this.domandeTemporizzateService.isTimerRunning()) {
      this.domandeTemporizzateService.resettaTimer();
      this.domandeTemporizzateService.startTimer();
    }

    if (!this.sottoscritto) {
      this.sottoscritto = true;
      this.fileService.getDomandeTemporizzate().subscribe(res => {
        this.domandeTemporizzate = res;
        if (this.domandeTemporizzate !== undefined) {
          this.subscription = this.domandeTemporizzateService.timerScattato.subscribe(r => {
            const prossimaDomanda = this.domandeTemporizzateService.getProssimaDomanda(this.domandeTemporizzate);
            if (prossimaDomanda != null) {
              this.domandeTemporizzateService.openRadioAlert(prossimaDomanda);
            }
          });
        }
      });
    }

    this.domandeTemporizzateService.punteggioVariato.pipe(takeUntil(this.unsubscribe)).subscribe(r => {
      this.punteggio = r;
    });

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

  ngOnDestroy(): void {
    if (this.sottoscritto) {
      this.subscription.unsubscribe();
      this.sottoscritto = false;
    }
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

  ionViewDidEnter() {
    if (!this.sottoscritto) {
      this.sottoscritto = true;
      this.fileService.getDomandeTemporizzate().subscribe(res => {
        this.domandeTemporizzate = res;
        if (this.domandeTemporizzate !== undefined) {
          this.subscription = this.domandeTemporizzateService.timerScattato.subscribe(r => {
            const prossimaDomanda = this.domandeTemporizzateService.getProssimaDomanda(this.domandeTemporizzate);
            if (prossimaDomanda != null) {
              this.domandeTemporizzateService.openRadioAlert(prossimaDomanda);
            }
          });
        }
      });
    }
  }

  ionViewDidLeave() {
    if (this.sottoscritto) {
      this.subscription.unsubscribe();
      this.sottoscritto = false;
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
