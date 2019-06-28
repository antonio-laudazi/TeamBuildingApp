import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../services/services.store';
import { Modello } from '../../models/gruppo.namespace';

@Component({
  selector: 'app-parole',
  templateUrl: 'parole.page.html',
  styleUrls: ['parole.page.scss']
})
export class ParolePage implements OnInit {

  public tappeCompletate: Array<Modello.Tappa>;
  private tappeScelte: Array<Modello.Tappa>;

  constructor(private storeService: StoreService) {
    this.storeService.getTappeScelte().then((tappeScelteString) => {
      this.tappeScelte = JSON.parse(tappeScelteString);
      this.tappeCompletate = this.tappeScelte.filter((tappa) => tappa.completata === 1);
      console.log('this.tappeCompletate.length' + this.tappeCompletate.length);
    });
  }

  ngOnInit() {
  }
  // add back when alpha.4 is out
  // navigate(item) {
  //   this.router.navigate(['/list', JSON.stringify(item)]);
  // }
}
