import {Component, Input} from '@angular/core';

@Component({
	selector: 'leaders',
	templateUrl: 'leaderboard.comp.html'
})
export class LeaderboardComponent {
	/* Takes WorkoutId */
	@Input()
	workoutId: string;

	constructor() {}
}