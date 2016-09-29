import { Component, Input, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AthleteService } from '../../services/AthleteService';
import { WorkoutService } from '../../services/WorkoutService';
import { WorkoutForm } from '../../pages/workout/workoutForm';
import { FirebaseObjectObservable } from 'angularfire2';

@Component({
	selector: 'result',
	templateUrl: 'result.comp.html'
})
export class ResultComponent implements OnInit{
	@Input() result: any = {};
	public athlete: FirebaseObjectObservable<any>;
	public workout: FirebaseObjectObservable<any>;
	public photoURL;

	constructor(public workouts: WorkoutService,
				public athletes: AthleteService,
				private nav: NavController) {
	}

	ngOnInit() {
		/* this.workouts.getWorkout(this.result.workoutId).subscribe(snapshot => {
			this.workout = snapshot.val();
			this.workout.id = snapshot.key;
		}); */
		this.athlete = this.athletes.getAthlete(this.result.athleteId);
		this.athlete.subscribe( data => {
			this.photoURL = data.photoURL;
		})
	}

	addResult(_event, workout) {
		console.log('Add a result to ', workout);
		this.nav.push(WorkoutForm, { workout: this.workout });
	}


}