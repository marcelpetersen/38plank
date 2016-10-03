import { Component, Input, OnInit } from '@angular/core';
import { NavController, App } from 'ionic-angular';
import { WorkoutService } from '../../services/WorkoutService';
import { AthleteService } from '../../services/AthleteService';
import { FirebaseObjectObservable } from 'angularfire2';
import { WorkoutForm } from '../../pages/workout/workoutForm';

@Component({
	selector: 'workout-card',
	templateUrl: 'workout-card.comp.html'
})
export class WorkoutCardComponent implements OnInit {
	@Input() workoutId: string;
	public workout: FirebaseObjectObservable<any>;
	public athlete: FirebaseObjectObservable<any>;
	public workoutPhotoURL;

	constructor(
				public app: App,
				public workouts: WorkoutService,
				public nav: NavController,
				public athletes: AthleteService) {

	}

	ngOnInit() {
		/* Get Workout Details */
		this.workout = this.workouts.getWorkout(this.workoutId);
		this.workout.subscribe( (data) => {
			this.athlete = this.athletes.getAthlete(data.createdBy);
		});
	}

	goToWorkout() {
		this.app.getRootNav().push(WorkoutForm, {workoutId: this.workoutId});
	}

}
