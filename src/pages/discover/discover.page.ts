import {Component} from '@angular/core';
import {WorkoutService} from '../../services/workout.service';
import {FirebaseListObservable} from 'angularfire2';
// Temporary to find how to query
import {AngularFire} from 'angularfire2';
import {Subject} from 'rxjs/Subject';

@Component({
  templateUrl: 'discover.page.html'
})
export class DiscoverPage {
	public items: FirebaseListObservable<any>;
	public searchTerm: Subject<any> = new Subject();
	public tab: string = 'workout';

  	constructor(public workouts: WorkoutService,
  				public af: AngularFire) {
      console.log('Discover Page Construction');
  	}

  	getItems($event) {
		  this.searchTerm.next($event.target.value);
  	}

    ionViewDidEnter() {
      this.searchTerm.next('A');
    }

  	tabs(val) {
			this.tab = val;
  	}

  	get workout() {
			return (this.tab === 'workout');
  	}

  	get people() {
			return (this.tab === 'people');
  	}
}
