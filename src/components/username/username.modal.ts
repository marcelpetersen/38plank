import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { AuthService } from '../../services/AuthService';
import { AthleteService } from '../../services/AthleteService';
import { Subject } from 'rxjs';
import { AngularFire } from 'angularfire2';

@Component({
  templateUrl: 'username.modal.html'
})
export class UserNameModal {

  public error: any = null;
  public id: Subject<string> = new Subject<string>();
  public username: string;

  constructor(
    private viewCtrl: ViewController,
    public athletes: AthleteService,
    public auth: AuthService,
    public af: AngularFire
    ) {
    this.validate();
    }

  close() {
    this.viewCtrl.dismiss();
  }

  verify($event) {
    if (!$event.target.validity.valid) {
      this.error = $event.target.validationMessage;
    } else {
      this.id.next(this.username);
    }
  }

  validate() {
    console.log('verify');
    this.athletes.getAthletesByUsername(this.id).subscribe( (data) => {
      if (data.length > 0) {
        console.log(data);
        this.error = 'Username Already Exists';
      } else {
        this.error = null;
      }
    });

  }

  selectUsername() {
    if (!this.error) {
      this.athletes.update(this.auth.id , {
        username: this.username
      });
      this.close();
    }
  }
}
