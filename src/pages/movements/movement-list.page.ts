import { App } from 'ionic-angular';
import { Component } from '@angular/core';
import { MovementService } from '../../services/movement.service';
import { Movement } from '../../model/movement';
import { MovementForm } from './movement-form.page';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { AuthService } from '../../services/auth.service';

@Component({
  templateUrl: 'movement-list.page.html'
})
export class MovementListPage {

  public movementList: Observable<Movement[]>;
  // Search isnt implemented
  public searchQuery: Subject<any> = new Subject();

  constructor(
          public app: App,
          public movements: MovementService,
          public auth: AuthService) {
          this.movementList = this.movements.getMovementsByName(this.auth.id, this.searchQuery);
          this.movementList.subscribe( (data) => {
            console.log('Movement List:' , data);
          });
  }

  moreInfo(movement: Movement) {
    this.app.getRootNav().push(MovementForm, {'movementId': movement.$key});
  }

  getMovements($event): void {
    this.searchQuery.next($event.target.value);
  }
}
