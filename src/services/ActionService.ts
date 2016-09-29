import {Injectable} from '@angular/core';
import {AngularFire, FirebaseObjectObservable} from 'angularfire2';
import {Action} from '../model/action';

@Injectable()
export class ActionService {

    constructor(public af: AngularFire) {}

    logAction(action: Action): string {
      let key = this.af.database.list('/actions').push(action).key;
      this.af.database.list('/athletes/' + action.createdBy + '/actions').push({id: key});
      return key;
    }

    getAction(id: string): FirebaseObjectObservable<Action> {
      return this.af.database.object('/actions/' + id);
    }
}
