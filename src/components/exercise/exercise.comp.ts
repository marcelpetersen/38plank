import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from 'ionic-angular';
import {Movement} from '../../model/movement';
import {Exercise} from '../../model/exercise';
import {MovementService} from '../../services/movement.service';
import {ExerciseService} from '../../services/exercise.service';
import {FirebaseObjectObservable, FirebaseListObservable} from 'angularfire2';
import {PropertiesChange} from '../properties/properties-change.modal';

@Component({
	selector: 'exercise',
	templateUrl: 'exercise.comp.html'
})
export class ExerciseComponent implements OnInit {
	@Input() exerciseId: string;
	public exercise: FirebaseObjectObservable<Exercise>;
	public movement: FirebaseObjectObservable<Movement>;
	public properties: FirebaseListObservable<any>;
	@Input() editable: boolean = true;

	constructor(public exercises: ExerciseService,
				public movements: MovementService,
				public modalCtrl: ModalController) {
	}

	ngOnInit() {
		if (this.exerciseId) {
			console.log('Exercise Id' , this.exerciseId);
			// Get Exercise
			this.exercise = this.exercises.getExercise(this.exerciseId);
			this.properties = this.exercises.getProperties(this.exerciseId);
			this.exercise.first().subscribe( (data) => {
				// Think about using generators?
				this.movement = this.movements.getMovement(data.movementId);
			}, () => {
				console.log('Exercise Complete');
			});

		}
	}

	editProperties($event) {
		$event.preventDefault();

		if (this.editable) {
			// Create Property Modal with Selections?
			let propertiesModal = this.modalCtrl.create(PropertiesChange, {
				exerciseId: this.exerciseId
			});
			propertiesModal.present();
		}
	}
}
