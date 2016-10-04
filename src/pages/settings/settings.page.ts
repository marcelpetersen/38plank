import {Component} from '@angular/core';
import {AuthService} from '../../services/AuthService';
import {AthleteService} from '../../services/AthleteService';
import {FirebaseObjectObservable} from 'angularfire2';
import {Athlete} from '../../model/Athlete';

@Component({
  templateUrl: 'settings.page.html'
})
export class SettingsPage {

	public athlete: FirebaseObjectObservable<Athlete[]>;
	public units: string;
  public form: any;

  constructor(private athletes: AthleteService,
	    private auth: AuthService) {
	   this.athlete = this.athletes.getAthlete(this.auth.id);
  }

  changeUnits() {
	 this.athlete.update({ 'units': this.form.units });
  }

  updateName() {
	 this.athlete.update({ 'name': this.form.name });
  }
  
	updateTeam() {
		this.athlete.update({ 'team': this.form.team });
  }
}
