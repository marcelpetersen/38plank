import { Platform } from 'ionic-angular';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AthleteService } from '../../services/athlete.service';
import { AngularFire } from 'angularfire2';

@Component({
    templateUrl: 'login.html'
})
export class LoginPage {

    public error: any;
    public createAccount: boolean = false;
    public userName: string;
    public isDev: boolean;

    constructor(public authService: AuthService,
                public athletes: AthleteService,
                public af: AngularFire,
                public platform: Platform) {
        console.log('Creating Login Page');
        this.platform = platform;
        console.log(JSON.stringify(this.platform.platforms()));
        if (!this.platform.is('cordova')) {
            this.isDev = true;
        }
    }

    login( credentials) {

        this.authService.passwordLogin(credentials)
        .then(success => {
            console.log('Login Succesful');
        }).catch(error => {
            console.warn('Login Error', error);
            this.error = error;
        });
    }

    check() {
        /* Validate Username is Unique */
        if (!this.athletes.getAthlete(this.userName)) {
            this.error = 'Username Already Exists';
        } else {
            this.error = null;
        }
    }

    emailLogin() {
        let credentials = { 'email': 'andrew3@gmail.com', password: 'andrew' };
        this.login(credentials);
    }

    registerUser(credentials, _event) {
        console.log(credentials);
        if (!(credentials &&
            credentials.email &&
            credentials.password &&
            credentials.team !== '' &&
            credentials.name !== '')) {
            this.error = 'Please Include All Fields';
            return;
        }
        /* Validate */
        _event.preventDefault();

        this.authService.createUser(credentials);
    }

    facebookLogin() {
        if (this.error) {
            return;
        }

        this.authService.loginWithFacebook().catch(error => {
            this.error = error;
        });
    }

    create(_event) {
        _event.preventDefault();
        console.log('Create Button');
        this.createAccount = true;
    }

}
