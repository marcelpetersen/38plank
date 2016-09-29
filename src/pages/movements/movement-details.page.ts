import {NavController, NavParams} from 'ionic-angular';
import {Component} from '@angular/core';
import {MovementService} from '../../services/MovementService';
import {Movement} from '../../model/movement';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
@Component({
  templateUrl: 'movement-details.page.html'
})
export class MovementDetailsPage {

  public url: SafeResourceUrl;
  public movement: Movement = new Movement({});

  constructor(public movements: MovementService,
  			  public nav: NavController,
          public params: NavParams,
          public sanitizer: DomSanitizer) {
    if (params.get('movement')) {
      this.movement = params.get('movement');
      console.log('Recieved Movement', this.movement);
      this.url = sanitizer.bypassSecurityTrustResourceUrl(this.movement.videoUrl);
    }
  }

}