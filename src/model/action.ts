export class Action {
	public date: number;
	public createdBy: string;
	public actionOnType: any;
	public actionOnId: string;
	public link: string;
	public action: string;

	constructor(obj?: any) {
		this.action = obj && obj.action || '';
		this.date = Date.now();
		this.createdBy = obj && obj.createdBy || undefined;
		this.actionOnType = obj && obj.actionOnType || '';
		this.actionOnId = obj && obj.actionOnId || '';
		this.link = obj && obj.link || '';
	}
}
