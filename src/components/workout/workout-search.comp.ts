import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { FirebaseListObservable } from 'angularfire2';

import { WorkoutService } from '../../services/workout.service';

@Component({
  selector: 'workout-search',
  templateUrl: 'workout-search.comp.html'
})
export class WorkoutSearchComponent implements OnInit {
  @Input() searchTerm: Subject<any>;
  public items: FirebaseListObservable<any>;

  constructor(public workouts: WorkoutService) {
    console.log('Constructing Workout Search');
  }

  ngOnInit() {
    // Start searching
    this.items = this.workouts.getWorkoutsByName(this.searchTerm);
  }
  
}