export class Movement {
	public name: string;
	public type: string;
	public properties: Array<string>;
	public id: string;
	public verified: boolean;
	public videoUrl: string;
	public thumbnail: string;
	public createdBy: string;
	public images: Array<any>;

	constructor(obj?: any) {
		this.createdBy = obj && obj.createdBy || '';
		this.name = obj && obj.name || '';
		this.type = obj && obj.type || 'Custom';
		this.properties = ['weight' , 'repetitions' , 'distance', 'time'];
		this.id = obj && obj.id || '';
		this.verified = obj && obj.verified || false;
		this.videoUrl = obj && obj.videoUrl || '';
		this.thumbnail = obj && obj.thumbnail || '';
		this.images = obj && obj.images || [];
	}

}
