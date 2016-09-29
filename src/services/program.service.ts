import { Injectable } from '@angular/core';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';

@Injectable()
export class ProgramService {

    constructor(public af: AngularFire) {
    	// this.bootstrap();
    }

    bootstrap() {
      this.af.database.list('/programs/-KS2TR5f0l4E89K1iuk2/workouts').push({
      	id: '-KRyLnBZKeOca3k9iCzW',
      	date: Date.now()
      });
    }

    getProgram(id: string): FirebaseObjectObservable<any> {
      return this.af.database.object('/programs/' + id);
    }

}
