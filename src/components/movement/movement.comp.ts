import {Component, Input} from '@angular/core';

@Component({
	selector: 'movement',
	templateUrl: 'movement.comp.html'
})
export class MovementComponent {
	/* Takes WorkoutId */
	@Input() movement;

	constructor() {}
}
