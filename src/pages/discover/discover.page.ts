import {Component} from '@angular/core';
import {WorkoutService} from '../../services/WorkoutService';
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
		this.initiateSearchBar();
  	}

  	getItems($event) {
		  this.searchTerm.next($event.target.value);
  	}

  	initiateSearchBar() {
  		/* Start with just relevance, then add likes or "top" posts
  			By merging rxjs streams 
  		*/
      this.items = this.workouts.getWorkoutsByName(this.searchTerm);
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
