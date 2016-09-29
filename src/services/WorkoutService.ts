import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Workout} from '../model/workout';
import {Subject} from 'rxjs/Subject';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';

@Injectable()
export class WorkoutService {
    public workoutsRef = firebase.database().ref('workouts');

    constructor(public af: AngularFire) {}

    deleteWorkout(id: string) {
        // Think about removing other instances? or just everything having to deal with nulls
        this.af.database.object('/workouts/' + id).remove();
    }

    getAll(): FirebaseListObservable<Workout[]> {
        return this.af.database.list('/workouts', {
            query: {
                orderByKey: true,
                limitToLast: 20
            }
        });
    }

    getImages(id: string): FirebaseListObservable<any> {
        return this.af.database.list('/workouts/' + id + '/images');
    }

    getWorkout(id: string, options?: any): FirebaseObjectObservable<any> {
        if (options) {
            return this.af.database.object('/workouts/' + id, options);
        } else {
            return this.af.database.object('/workouts/' + id);
        }
    }

    getWorkoutsByCreator(id: string): FirebaseListObservable<any> {
        return this.af.database.list('/workouts', {
            query : {
                orderByChild: 'createdBy',
                equalTo: id,
                limitToFirst: 10
            }
        });
    }

    getWorkoutsByName(name: Subject<any>) {
        return this.af.database.list('/workouts', {
                query: {
                    orderByChild: 'name',
                    startAt: name,
                    limitToFirst: 10
                }
            });
    }

    addWorkout(workout: Workout): string {
      console.log('Adding Workout: ', workout);
      return this.af.database.list('/workouts').push(workout).key;
    }

    getExercises(id: string): FirebaseListObservable<any> {
        return this.af.database.list('/workouts/' + id + '/exercises');
    }

    removeExercise(workoutId: string, exerciseId: string) {
        this.af.database.object('/exercises/' + exerciseId).remove();

        let exercisesRef = firebase.database().ref('workouts')
            .child(workoutId)
            .child('exercises');

        exercisesRef.once('value', (snapshot) => {
                let list = snapshot.val();
                let index = list.indexOf(exerciseId);
                console.log('Starting List' , list);
                list.splice(exerciseId, 1);
                console.log('Resulting List', list);
                exercisesRef.set(list);
            });
    }

    addExercise(workoutId: string, exerciseId: string): void {
        // Have to do it without 
        let exercisesRef = firebase.database().ref('workouts')
            .child(workoutId)
            .child('exercises');

        exercisesRef.once('value' , (snapshot) => {
            let list = [];
            if (snapshot.val()) {
                list = snapshot.val();
            }
            list.push(exerciseId);
            exercisesRef.set(list);
        });
    }
}
