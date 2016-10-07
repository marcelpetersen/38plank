import { ViewChild, AfterViewInit, Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Action } from '../../model/action';
import { WorkoutService } from '../../services/workout.service';
import { ActionService } from '../../services/action.service';
import { AuthService } from '../../services/auth.service';
import { ResultPage } from '../result/result.page';

@Component({
	templateUrl: 'completion-workout.comp.html'
})
export class CompletionWorkout implements AfterViewInit {
	workout: any;
	public exerciseList: Array<any>;
	public timeElapsed: number = 0;
	public workoutStarted: boolean = false;
	public intervalId: any;
	@ViewChild('canvas') canvas: any;
	@ViewChild('backgroundCanvas') backgroundCanvas: any;

	constructor(private workouts: WorkoutService,
				private nav: NavController,
				private params: NavParams,
				public actions: ActionService,
				public auth: AuthService) {
		if (this.params && this.params.get('workout')) {
			this.workout = this.params.get('workout');
		}
	}

	// Should refactor into timer component
	ngAfterViewInit() {
	  var context = this.backgroundCanvas.nativeElement.getContext('2d');
      var centerX = this.backgroundCanvas.nativeElement.width / 2;
      var centerY = this.backgroundCanvas.nativeElement.height / 2;
      var radius = 70;
	  context.beginPath();
      context.arc(centerX, centerY, radius, 0, Math.PI * 2, false);
      context.lineWidth = 6;
      context.strokeStyle = '#000000';
      context.stroke();
      context.closePath();
	}

	// Refactor
	drawArc() {
	  var context = this.canvas.nativeElement.getContext('2d');
      var centerX = this.canvas.nativeElement.width / 2;
      var centerY = this.canvas.nativeElement.height / 2;
      var radius = 70;

      context.beginPath();
      let startAngle = (Math.PI / 180) * -90;
      let endAngle = (Math.PI / 180) * (360 * ((this.timeElapsed % 60) / 60) - 90);
      if (this.timeElapsed % 60 === 0 && this.timeElapsed !== 0) {
      	endAngle = Math.PI * 2;
      }
      context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
      context.arc(centerX, centerY, radius, startAngle, endAngle, false);
      context.lineWidth = 6;
      context.strokeStyle = '#06D3CA';
      context.stroke();
      context.closePath();
	}

	start(): void {
		this.workoutStarted = true;
		this.intervalId = setInterval(() => {
			if (this.workoutStarted) {
				this.timeElapsed++;
				this.drawArc();
			}
		}, 1000);
	}

	pause(): void {
		clearInterval(this.intervalId);
		this.workoutStarted = false;
	}

	complete(): void {
		// Navigate to result page, maybe result overlay?
		console.log('Workout Complete!', this.workout);
		this.workoutStarted = false;
		this.logAction();
		this.nav.push(ResultPage, {
			result: this.timeElapsed,
			resultType: this.workout.resultType,
			workoutId: this.workout.$key
		});
	}

	logAction() {
		let act = new Action({
			createdBy: this.auth.id,
			actionOnType: 'Workout',
			actionOnId: this.workout.$key,
			action: 'Completed'
		});
		this.actions.logAction(act);
	}

	back() {
		this.nav.pop();
	}
}
