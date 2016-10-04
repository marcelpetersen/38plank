import { App } from 'ionic-angular';
import { Component } from '@angular/core';
import { MovementService } from '../../services/MovementService';
import { Movement } from '../../model/movement';
import { MovementForm } from './movement-form.page';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../services/AuthService';

@Component({
  templateUrl: 'movement-list.page.html'
})
export class MovementListPage {

  public movementList: Observable<Movement[]>;
  // Search isnt implemented
  public searchQuery: any;

  constructor(
          public app: App,
          public movements: MovementService,
          public auth: AuthService) {

  }

  ngOnInit() {
	  this.movementList = this.movements.getMovements(this.auth.id);
	  // this.movements.bootstrap();
  }

  moreInfo(movement: Movement) {
    this.app.getRootNav().push(MovementForm, {'movementId': movement.$key});
  }

  getMovements($event): void {

  }
}
