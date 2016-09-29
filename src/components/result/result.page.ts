import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {AthleteService} from '../../services/AthleteService';
import {ResultService} from '../../services/ResultService';
import {WorkoutService} from '../../services/WorkoutService';
import {AuthService} from '../../services/AuthService';
import {Result} from '../../model/result';
import {CameraService} from '../../services/CameraService';

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
	    let options = {
	      sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
	      mediaType: Camera.MediaType.PICTURE,
	      allowEdit: true
	    };

	    this.camera.getPicture(options).then( (res) => {
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
