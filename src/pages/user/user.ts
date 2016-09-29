import { NavController } from 'ionic-angular';
import { Component } from '@angular/core';
import { AuthService } from '../../services/AuthService';
import { AthleteService } from '../../services/AthleteService';
import { Workout } from '../../model/workout';
import { Athlete } from '../../model/athlete';
import { Action } from '../../model/action';
import { Result } from '../../model/result';
import { Movement } from '../../model/movement';
import { ResultService } from '../../services/ResultService';
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { SettingsPage } from '../settings/settings.page';
import { WorkoutService } from '../../services/WorkoutService';
import { MovementService } from '../../services/MovementService';

@Component({
  templateUrl: 'user.html'
})
export class UserPage {

  public athlete: FirebaseObjectObservable<Athlete>;
  public actionList: FirebaseListObservable<Action>;
  public workoutList: FirebaseListObservable<Workout>;
  public resultList: FirebaseListObservable<Result>;
  public movementList: FirebaseListObservable<Movement>;

  public feed: boolean = true;
  public content: boolean = false;

  constructor(private auth: AuthService,
              private athletes: AthleteService,
              private results: ResultService,
              private workouts: WorkoutService,
              private movements: MovementService,
              private nav: NavController) {
      this.athlete = this.athletes.getAthlete(this.auth.id);
      this.actionList = this.athletes.getActions(this.auth.id);
      this.workoutList = this.workouts.getWorkoutsByCreator(this.auth.id);
      this.resultList = this.results.getByAthlete(this.auth.id);
      this.movementList = this.movements.getMovementsByCreator(this.auth.id);
  }

  logout() {
    console.log('Logout');
    this.auth.logout();
  }

  feedTab() {
    this.feed = true;
    this.content = false;
  }

  contentTab() {
    this.feed = false;
    this.content = true;
  }

  settings() {
    this.nav.push(SettingsPage);
  }
}
