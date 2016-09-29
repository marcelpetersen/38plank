export class Workout {
    public name: string;
    public category: string;
    public exercises: any;
    public resultType: any;
    public id: string;
    public createdBy: string;
    public description: string;
    public duration: number;
    public likes: number;
    public thumbnail: string;
    public completionCount: number;

    constructor(obj?: any) {
        this.name = obj && obj.name || 'New Workout';
        this.category = obj && obj.category || 'Custom';
        this.createdBy = obj && obj.createdBy || '';
        this.exercises = obj && obj.exercises || [];
        this.resultType = obj && obj.resultType || '';
        this.id = obj && obj.id || '';
        this.description = obj && obj.description || 'New workout description';
        this.duration = obj && obj.duration || 100;
        this.likes = obj && obj.likes || 0;
        this.thumbnail = obj && obj.thumbnail || { imageURL: 'https://firebasestorage.googleapis.com/v0/b/popping-inferno-7577.appspot.com/o/Log-carry.jpeg?alt=media&token=d141b60f-516b-4bcd-a769-2e2c40c77498' }// tslint:disable-line
        this.completionCount = obj && obj.completionCount || 0;
    }

    /* Should be done via constructor overload */
    reset() {
		this.name = '';
		this.category = '';
		this.exercises = [];
		this.resultType = '';
		this.id = '';
    }
}
