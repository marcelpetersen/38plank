export class Like {
	public createdBy: string;
	public date: number;

	constructor(obj?: any) {
		this.createdBy = obj && obj.createdBy || '';
		this.date = Date.now();
	}

	get message(): string {
		return '';
	}
}
