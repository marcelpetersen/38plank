import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Movement } from '../model/movement';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { Subject } from 'rxjs';

@Injectable()
export class MovementService {
    public movements = firebase.database().ref('movements');

    constructor(public af: AngularFire) {}

    getMovements(id: string): Observable<any> {
        // Return Movements either user created, or fittist created (currently just katies username)
        let userCreated = this.af.database.list('/movements', {
            query: {
                orderByChild: 'createdBy',
                equalTo: id
            }
        });

        let standard = this.af.database.list('/movements', {
            query: {
                orderByChild: 'createdBy',
                equalTo: 'Sdn1tES0snWXRgYV4ITy1xf1uqu1'
            }
        });
        // Combine the two observables and emit one array
        return Observable.combineLatest(userCreated, standard, (s1 , s2) => {
            return s1.concat(s2);
        });
    }

    deleteMovement(id: string): any {
        return this.af.database.object('/movements/' + id).remove();
    }

    getMovement(id: string): FirebaseObjectObservable<any> {
        /* Validate */
        // return this.movements.child(id).once('value');
        return this.af.database.object('/movements/' + id);
    }

    getMovementsByCreator(id: string): FirebaseListObservable<any> {
        return this.af.database.list('/movements', {
            query: {
                orderByChild: 'createdBy',
                equalTo: id,
                limitToFirst: 10
            }
        });
    }

    getMovementMedia(movementId: string): FirebaseListObservable<any> {
      return this.af.database.list('/movements/' + movementId + '/content');
    }

    createMovement(movement: Movement) {
        return this.af.database.list('/movements').push(movement);
    }

    getImages(id: string): FirebaseListObservable<any> {
        return this.af.database.list('/movements/' + id + '/images');
    }

    getMovementsByName(id: string, name: Subject<any>): Observable<any[]> {
        // Start with movements accesable to the user
        let list = this.af.database.list('/movements', {
                query: {
                    orderByChild: 'name',
                    startAt: name
                }
        });

        // Another way of only getting movements of a certain type
        return list.map( (arr: any[], idx: number) => {
            return arr.filter( (move) => {
                return (move.createdBy === id || move.createdBy === 'qaydNqdgrtYDxslZ86QT0gdw7yi2');
            });
        });
    }

}

