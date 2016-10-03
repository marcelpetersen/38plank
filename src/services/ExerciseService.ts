import {Injectable} from '@angular/core';
import {Workout} from '../model/workout';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';

@Injectable()
export class ExerciseService {

    constructor(public af: AngularFire) {}

    getAll(): FirebaseListObservable<Workout[]> {
        return this.af.database.list('/workouts', {
            query: {
                orderByKey: true,
                limitToLast: 20
            }
        });
    }

    getExercise(id: string): FirebaseObjectObservable<any> {
        return this.af.database.object('/exercises/' + id);
    }

    createExercise(exercise: any) {
        return this.af.database.list('/exercises').push(exercise).key;
    }

    getProperties(id: string): FirebaseListObservable<any> {
        return this.af.database.list('/exercises/' + id + '/properties');
    }

}
