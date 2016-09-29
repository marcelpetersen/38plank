import { OnInit, Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { WorkoutService } from '../../services/WorkoutService';
import { WorkoutForm } from '../../pages/workout/workoutForm';
import { FirebaseObjectObservable } from 'angularfire2';
import { AthleteService } from '../../services/AthleteService';

@Component({
	selector: 'workout',
	templateUrl: 'workout.comp.html'
})
export class WorkoutComponent implements OnInit {
	@Input() workoutId: string;
	@Input() workout: any;
	public athlete: FirebaseObjectObservable<any>;
	public workoutName: string;
	@Input() editable: boolean = false;
	public images: FirebaseListObservable<any>;

	constructor(private workouts: WorkoutService,
				private athletes: AthleteService,
				private nav: NavController) {}

	get diagnostic() {
		return JSON.stringify(this.workoutId);
	}

	ngOnInit() {
		/* Get Workout Details */
		if (!this.workout) {
			this.workout = this.workouts.getWorkout(this.workoutId);
			this.workout.first().subscribe((data) => {
				this.athlete = this.athletes.getAthlete(data.createdBy);
			});
			this.images = this.workouts.getImages(this.workoutId);
		} else if (this.workout instanceof FirebaseObjectObservable) {
			console.log('Instance Of FirebaseObjectObservable');
		}
	}

	updateName($event) {
		console.log('event: ' , $event);
		this.workout.update({'name': $event.target.value});
	}

	navigate() {
		if (!this.editable) {
			this.nav.rootNav.push(WorkoutForm, {
				workoutId: this.workoutId
			});
		}
	}

}
