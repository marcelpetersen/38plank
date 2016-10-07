import {Component, Input} from '@angular/core';
import {MovementService} from '../../services/movement.service';
import {Movement} from '../../model/movement';

@Component({
	selector: 'complex-movements',
	templateUrl: 'complex-movements.comp.html'
})
export class ComplexMovementsComponent {
	@Input()
	complex: any;
	movements: Movement[] = [];

	constructor(public moves: MovementService) {

	}

	ngOnInit() {
			for (var i = 0; i < this.complex.movements.length;i++) {
				if (this.complex.movements[i]) {
					this.moves.getMovement(this.complex.movements[i]).subscribe( (data) => {
						console.log('Movement Data');
						this.movements.push(data.val());
					});
				}
			}
	}

}