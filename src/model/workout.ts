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
        this.thumbnail = obj && obj.thumbnail || { url: 'https://firebasestorage.googleapis.com/v0/b/popping-inferno-7577.appspot.com/o/images%2Fdumbell%20logo.png?alt=media&token=c985e1bc-4253-42b8-ad5c-4bcda93385a2' }// tslint:disable-line
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
