import { MenuController, Platform } from 'ionic-angular';
import { AnalyticsService } from '../../services/AnalyticsService';
import { Component } from '@angular/core';
import { ResultService } from '../../services/ResultService';
import { Observable } from 'rxjs/Observable';


@Component({
  templateUrl: 'home.html'
})
export class HomePage {

  public resultPipe: Observable<any>;

  constructor(public result: ResultService,
  				public menu: MenuController,
          public analytics: AnalyticsService,
          public platform: Platform) {
    /* Get list of workouts from the workout service */
    this.resultPipe = this.result.getLimited(10).map((arr) => { return arr.reverse(); });
    this.menu = menu;

    // Try Facebook events api 
  }

  ionViewEnter() {
    // Check for app updates
  }

  openMenu() {
    this.menu.open();
  }

}
