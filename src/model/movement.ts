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
	public $key: string;

	constructor(obj?: any) {
		this.createdBy = obj && obj.createdBy || '';
		this.name = obj && obj.name || '';
		this.type = obj && obj.type || 'Custom';
		this.properties = ['weight' , 'repetitions' , 'distance', 'time'];
		this.id = obj && obj.id || '';
		this.verified = obj && obj.verified || false;
		this.videoUrl = obj && obj.videoUrl || '';
		this.thumbnail = obj && obj.thumbnail || { 'imageURL': 'https://firebasestorage.googleapis.com/v0/b/popping-inferno-7577.appspot.com/o/images%2Fdumbell%20logo.png?alt=media&token=c985e1bc-4253-42b8-ad5c-4bcda93385a2', name:'defaultDumbel' };
		this.images = obj && obj.images || [];
	}

}
