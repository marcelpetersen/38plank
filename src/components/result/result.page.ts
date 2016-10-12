import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AthleteService } from '../../services/athlete.service';
import { ResultService } from '../../services/result.service';
import { WorkoutService } from '../../services/workout.service';
import { AuthService } from '../../services/auth.service';
import { Result } from '../../model/result';
import { CameraService } from '../../services/camera.service';

@Component({
	templateUrl: 'result.page.html'
})
export class ResultPage {

	public result: Result;

	constructor(public workouts: WorkoutService,
				public athletes: AthleteService,
				public results: ResultService,
				public camera: CameraService,
				public auth: AuthService,
				private nav: NavController,
				private params: NavParams) {
		this.result = new Result({
			athleteId: this.auth.id,
			workoutId: this.params.get('workoutId'),
			result: this.params.get('result'),
			resultType: this.params.get('resultType')
		});

		console.log('Result: ', this.result, this.params.get('result'));
	}

	save() {
		// Update athlete, workout, results
		let key = this.results.addResult(this.result);
		this.athletes.addResult(this.auth.id , key);
		this.nav.popToRoot();
	}

	addPhoto() {
		console.log('Image Options');
		/* Select and upload Image from service */

	    this.camera.getMedia().then( (res: any): void => {
	      let imageObj = {
	        imageURL: res.url,
	        name: res.img.name
	      };
	      this.result.image = imageObj;
	    }).catch((error) => {
	      console.warn('Error Occured' + JSON.stringify(error));
	    });
	}
}
