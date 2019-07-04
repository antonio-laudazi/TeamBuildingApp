import { Component, OnInit, OnDestroy } from '@angular/core';
import { StoreService } from '../../services/services.store';
import { FileService } from '../../services/services.file';
import { DomandeTemporizzateService } from '../../services/services.domandeTemporizzate';
import { Modello } from '../../models/gruppo.namespace';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-parole',
  templateUrl: 'parole.page.html',
  styleUrls: ['parole.page.scss']
})
export class ParolePage implements OnInit {

  private unsubscribe: Subject<boolean> = new Subject<boolean>();

  public tappeCompletate: Array<Modello.Tappa>;
  private tappeScelte: Array<Modello.Tappa>;
  private domandeTemporizzate;

  constructor(private storeService: StoreService,
              private domandeTemporizzateService: DomandeTemporizzateService,
              private fileService: FileService) {
    this.storeService.getTappeScelte().then((tappeScelteString) => {
      this.tappeScelte = JSON.parse(tappeScelteString);
      this.tappeCompletate = this.tappeScelte.filter((tappa) => tappa.completata === 1);
      console.log('this.tappeCompletate.length' + this.tappeCompletate.length);
    });
  }

  ngOnInit() {
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
