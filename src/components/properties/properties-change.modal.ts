import {Component} from '@angular/core';
import {NavParams, ViewController, NavController} from 'ionic-angular';
import {ExerciseService} from '../../services/exercise.service';
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

@Component({
	templateUrl: 'properties-change.modal.html'
})
export class PropertiesChange {
	public exerciseId: string;
	private exercise: FirebaseObjectObservable<any>;
	private propertiesList: FirebaseListObservable<any>;
	public propertiesForm: any = {};

	constructor(private exercises: ExerciseService,
				public params: NavParams,
				public viewCtrl: ViewController,
				public nav: NavController) {
		if (this.params.get('exerciseId')) {
			this.exerciseId = this.params.get('exerciseId');
			this.exercise = this.exercises.getExercise(this.exerciseId);
			this.propertiesList = this.exercises.getProperties(this.exerciseId);
			this.propertiesList.subscribe((data) => {
					// Set-up form values
					data.forEach( (property) => {
						this.propertiesForm[property.$key] = property.$value;
					});
				}, (error) => {
					console.warn(error);
				}, () => {
					console.log('Complete properties');
				});
		}
	}

	cancel() {
		this.nav.pop();
	}

	onSubmit() {
		console.log('Form Submit', this.propertiesForm);
		this.exercise.update({'properties': this.propertiesForm}).catch( (error) => {
			console.log('Update error', error);
		}).then( (success) => {
			console.log('Successful update: ' , success);
			this.nav.pop();
		});
	}
}
