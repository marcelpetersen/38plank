// Outside Libraries
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { Component } from '@angular/core';
import 'rxjs';
import { FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
// Model Objects
import { Workout } from '../../model/workout';
import { Exercise } from '../../model/exercise';
import { Action } from '../../model/action';
// Services
import { AuthService } from '../../services/auth.service';
import { WorkoutService } from '../../services/workout.service';
import { ActionService } from '../../services/action.service';
import { CameraService } from '../../services/camera.service';
import { StorageService } from '../../services/storage.service';
// Components & Models
import { SearchMovements } from '../../components/movement/movement-search.modal';
import { CompletionWorkout } from '../../components/workout/completion-workout.comp';

@Component({
    templateUrl: 'workoutForm.html'
})
export class WorkoutForm {

    public workoutId: string;
    public workout: FirebaseObjectObservable<Workout>;
    public exerciseList: FirebaseListObservable<any>;
    public editable: boolean = false;
    public editing: boolean = false;
    error: any;

    constructor(public workouts: WorkoutService,
                public modalCtrl: ModalController,
                public camera: CameraService,
                public storage: StorageService,
                public auth: AuthService,
                public actions: ActionService,
                public params: NavParams,
                public nav: NavController) {
        /* Either recieve a workout to edit, or create a new workout */
        if (this.params && this.params.get('workoutId')) {
            this.workoutId = this.params.get('workoutId');
            console.log('Recieved Workout: ', this.params.get('workoutId'));
            this.workout = this.workouts.getWorkout(this.workoutId);
            this.exerciseList = this.workouts.getExercises(this.workoutId);
        } else {
            // Create New Workout
            this.workoutId = this.workouts.addWorkout(new Workout({
                createdBy: this.auth.id
            }));
            this.workout = this.workouts.getWorkout(this.workoutId);
            this.exerciseList = this.workouts.getExercises(this.workoutId);
            console.log('exercises' , this.exerciseList);
            // Log Action
            this.addAction();
            this.editing = true;
        }

        this.workout.first().subscribe( (data) => {
            if (data.createdBy === this.auth.id) {
                this.editable = true;
            }
        });
    }

    addAction() {
        let act = new Action({
            action: 'Created',
            createdBy: this.auth.id,
            actionOnType: 'Workout',
            actionOnId: this.workoutId
        });
        this.actions.logAction(act);
    }

    addPhoto(): void {

        this.camera.getMedia().then( (res: any): void => {
          let imageObj = { imageURL: res };
          this.workout.update({
              thumbnail: imageObj
          });
        }).catch((error) => {
          console.warn('Add Photo Error Occured: ' + JSON.stringify(error));
        });
    }

    addExercise(): void {
       let movementSearch = this.modalCtrl.create(SearchMovements, {
            options: {
                workoutId: this.workoutId
            }
        });
        movementSearch.present();
    }

    removeExercise(_exercise) {
        console.log('Deleting Exercise: ' , _exercise);
        this.workouts.removeExercise(this.workoutId, _exercise.$key);
        // this.exerciseList.remove(_exerciseId);
    }

    addMovement(movement: any) {
        console.log('Adding Movement', movement, this.exerciseList);
        this.exerciseList.push(new Exercise({
            movement: movement
        }));
    }

    save() {
        this.editing = false;
    }
    edit() {
        this.editing = true;
    }

    like(): void {

    }

    star(): void {

    }

    delete() {
        this.workouts.deleteWorkout(this.workoutId);
        this.nav.pop();
    }

    start() {
        /* Go to appropriate starting page */
        // Workout's are static
        this.workouts.getWorkout(this.workoutId, {preserveSnapshot: true}).first().subscribe((snapshot) => {
            let data = snapshot.val();
            data.$key = this.workoutId;
            
            switch (data.resultType) {
                case 'Completion':
                    console.log('Completion!', data);
                    this.nav.push(CompletionWorkout, {'workout': data});
                    break;
                default:
                    console.log('Default!', data);
                    this.nav.push(CompletionWorkout, {'workout': data});
                    break;
            }
        });
    }
}
