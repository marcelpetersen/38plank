import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {AngularFire, FirebaseObjectObservable, FirebaseListObservable} from 'angularfire2';

declare var firebase: any;

@Injectable()
export class AthleteService {

    public id: string;
    public athletes = firebase.database().ref('athletes');
    public workouts = firebase.database().ref('workouts');
    public cachedData: any = {};

    constructor(public af: AngularFire) {
        /* Get Athlete Information, on creation cache athlete info */
    }

    addResult(id: string, resultKey: string) {
        this.af.database.list('/athletes/' + id + '/results')
            .push({
                id: resultKey
            });
    }

    createAthlete(id: string, credentials: any) {
        return this.af.database.list('/athletes').update(id, {
                displayName: credentials.displayName
            }).then((success) => {
                console.log('Create Athlete Success: ', success);
            })
            .catch((error) => {
                console.warn('Create Athlete Error: ' , error);
            });
    }

    update(_id, updates) {
        this.athletes.child(_id).update(updates);
    }

    getAthletesById(id: Subject<any>) {
        return this.af.database.list('/athletes', {
            query: {
                orderByKey: true,
                equalTo: id
            }
        });
    }

    searchAthletesByUsername(username: Subject<any>) {
        return this.af.database.list('/athletes' , {
            query: {
                orderByChild: 'username',
                startAt: username,
                limitToFirst: 10
            }
        });
    }

    getAthletesByUsername(username: Subject<string>) {
        return this.af.database.list('/athletes', {
          query: {
            orderByChild: 'username',
            equalTo: username
          }
        });
    }

    /* Get Athlete Once */
    getAthlete(id: string): FirebaseObjectObservable<any> {
        /* Check if athlete exists */
        return this.af.database.object('/athletes/' + id);
    }

    getActions(id: string): FirebaseListObservable<any> {
        return this.af.database.list('/athletes/' + id + '/actions', {
            query: {
                orderByKey: true
            }
        });
    }

    getRecords(_id): FirebaseListObservable<any> {
        return this.af.database.list('/athletes/' + _id + '/records', {
            query: {
                orderByKey: true
            },
            preserveSnapshot: true
        });
    }

    addRecords(_workout, _id) {
        let _exercises = _workout.exercises;
        console.log('Checking For PR: ', _workout);
        /* Validate athlete records exist, if not create them locally*/
        this.getRecords(_id).subscribe( (snapshots) => {
            let records = [];
            if (snapshots.length < 1) {
                console.log('No Records Set, Initiating Records');
                records = [];
            } else {
                snapshots.forEach((snap) => {
                    records.push(snap.val());
                });
            }

                let found = false;
                // Sort through exercises, see if the properties are different / better 
                for (var i = 0; i < _exercises.length; i++) {
                    _exercises[i].properties.completionDate = Date.now();
                    // Check to see if complex exists in pr database 
                    for (var j = 0; j < records.length; j++) {
                        if (_exercises[i].complex === records[j].complex &&
                            _exercises[i].properties.reps === records[j].properties.reps) {
                            found = true;
                            console.log('Found Complex', records[j] , _exercises[i]);
                            // TODO: Find specific overwritting property
                            // Force to Numbers
                            if (Math.round(_exercises[i].properties.weight) > Math.round(records[j].properties.weight)) {
                                //
                                records[j] = _exercises[i];
                                console.log('Overwrite PR!', records[j]);
                            }
                        }
                    }
                    // No matching complex, add as new pr 
                    if (!found) {
                        console.log('New Pr!', _exercises[i]);
                        records.push(_exercises[i]);
                    }
                }
                this.af.database.list('/athletes/' + _id).update('records', records);
            // this.athletes.child(_id).child('records').set(records);
        });
            
    }

}