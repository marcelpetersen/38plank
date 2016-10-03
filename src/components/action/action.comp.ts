import {Component, OnInit, Input} from '@angular/core';
import {NavController} from 'ionic-angular';
import {FirebaseObjectObservable} from 'angularfire2';
import { App } from 'ionic-angular';
import {ActionService} from '../../services/ActionService';
import {AthleteService} from '../../services/AthleteService';
import {MovementService} from '../../services/MovementService';
import {WorkoutService} from '../../services/WorkoutService';
import {MovementForm} from '../../pages/movements/movement-form.page';
import {WorkoutForm} from '../../pages/workout/workoutForm';

@Component({
	selector: 'action',
	templateUrl: 'action.comp.html'
})
export class ActionComponent implements OnInit {
	@Input() actionId: string;
	public action: any = {};
	public athlete: FirebaseObjectObservable<any>;
	public actionOnObject: FirebaseObjectObservable<any>;

	constructor(
				public app: App,
				public nav: NavController,
				public actions: ActionService,
				public athletes: AthleteService,
				public movements: MovementService,
				public workouts: WorkoutService) {
	}

	ngOnInit() {
		/* Action is a passive object, cannot be edited */
		this.actions.getAction(this.actionId).first().subscribe( (data) => {
			/* Get the object and the person */
			this.action = data;
			this.athlete = this.athletes.getAthlete(data.createdBy);
			switch (data.actionOnType) {
				case 'Movement':
					this.actionOnObject = this.movements.getMovement(data.actionOnId);
					break;
				case 'Workout':
					this.actionOnObject = this.workouts.getWorkout(data.actionOnId);
					break;
				default:
					// code...
					break;
			}
		});
	}

	navigate() {
		switch (this.action.actionOnType) {
			case 'Movement':
				this.app.getRootNav().push(MovementForm, {
					movementId: this.action.actionOnId
				});
				break;
			case 'Workout':
				this.app.getRootNav().push(WorkoutForm, {
					workoutId: this.action.actionOnId
				});
				break;
			default:
				break;
		}
	}
}
