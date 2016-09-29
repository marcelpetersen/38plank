
export class Exercise {
	public movementId: string;
	public properties: any;

	constructor(obj?: any) {
		/* Most scenarios will involve passing only the movement */
		this.movementId = obj && obj.movementId || obj.movement.$key;
		this.properties = obj && obj.properties || {};
		if (obj.movement) {
			console.log(obj.movement);
			this.setDefaultProperties(obj.movement);
		}
	}

	setDefaultProperties(movement) {
		if (movement.properties) {
			for (let i = 0; i < movement.properties.length; i++) {
				if (!this.properties[movement.properties[i]]) {
					/* Zero out relative properties */
					this.properties[movement.properties[i]] = 0;
				}
			}
		}
	}
}
