import { Component } from '@angular/core';
import { NavController, ViewController, NavParams } from 'ionic-angular';
import { Exercise } from '../../model/Exercise';
import { MovementService } from '../../services/movement.service';
import { ExerciseService } from '../../services/exercise.service';
import { WorkoutService } from '../../services/workout.service';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../services/auth.service';
import { MovementForm } from '../../pages/movements/movement-form.page';

@Component({
  templateUrl: 'movement-search.modal.html'
})
export class SearchMovements {
  public image: any;
  public options: any;
  public showMenu: boolean = false;
  public error: any;
  public movementList: Observable<any[]>;
  public queryTerm: Subject<any> = new Subject();
  public workoutId: string;

  constructor(
    public viewCtrl: ViewController,
    public params: NavParams,
    public movements: MovementService,
    public exercises: ExerciseService,
    public workouts: WorkoutService,
    public auth: AuthService,
    public nav: NavController
    ) {
    if (this.params.get('options')) {
      this.options = this.params.get('options');
      this.workoutId = this.params.get('options').workoutId;
    }
    this.movementList = this.movements.getMovementsByName(this.auth.id, this.queryTerm);
  }

  ionViewDidEnter() {
    this.queryTerm.next('A');
  }

  close() {
    this.viewCtrl.dismiss();
  }

  query($event) {
    this.queryTerm.next($event.target.value);
  }

  createMovement() {
    this.nav.push(MovementForm);
  }

  select(movement) {
    /* Create Exercise */
    let exerciseId = this.exercises.createExercise(new Exercise({movement: movement}));
    console.log('Select: ', exerciseId);
    this.workouts.addExercise(this.workoutId, exerciseId);
    this.close();
  }
}
