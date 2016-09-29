export class Result {

	public id: string;
	public name: string;
	public athleteId: string;
	public workoutId: string;
	public result: number;
	public completionDate: any;
	public resultType: string;
	public private: boolean;

	constructor(obj?) {
		this.id = obj && obj.id || '';
		this.name = obj && obj.name || '';
		this.athleteId = obj && obj.athleteId || '';
		this.workoutId = obj && obj.workoutId || '';
		this.result = obj && obj.result || 0;
		this.resultType = obj && obj.resultType || '';
		this.completionDate = Date.now();
		this.private = obj && obj.private || false;
	}
}
