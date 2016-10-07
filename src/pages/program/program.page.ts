import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { FirebaseObjectObservable } from 'angularfire2';

import { ProgramService } from '../../services/program.service';
import { AthleteService } from '../../services/athlete.service';
import { AuthService } from '../../services/auth.service';

@Component({
  templateUrl: 'program.page.html'
})
export class ProgramPage {
  public programId: string;
  public program: FirebaseObjectObservable<any>;

  constructor(public params: NavParams,
    public auth: AuthService,
    public athletes: AthleteService,
    public programs: ProgramService) {

    if (this.params && this.params.get('programId')) {
      this.programId = this.params.get('programId');
      this.program = this.programs.getProgram(this.programId);
    } else {
  		// Fallback is personal program

  		console.log('Athlete');
      this.athletes.getAthlete(this.auth.id).subscribe( (data) => {
        this.programId = data.program;
        this.program = this.programs.getProgram(data.program);
      });
    }
  }


}
