import { Injectable} from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods, FirebaseAuthState } from 'angularfire2';
import { Facebook } from 'ionic-native';

@Injectable()
export class AuthService {

    public user: any;

    constructor(public af: AngularFire) {
        // Watch User here
        this.af.auth.subscribe( (auth: any): void => {
            this.user = auth;
        });
    }

    getAuth() {
        return firebase.auth().currentUser;
    }

    get id() {
        return firebase.auth().currentUser.uid;
    }

    get displayName() {
        return firebase.auth().currentUser.displayName;
    }

    logout() {
        return firebase.auth().signOut();
    }

    updateProfile(updates) {
        firebase.auth().currentUser.updateProfile(updates)
            .then((success) => {
                console.log('Update Profile Success: ', success);
                console.log(firebase.auth().currentUser);
            })
            .catch((error) => {
                console.warn('Update Profile Error: ' , error);
            });
    }

    passwordLogin(credentials) {
        return this.af.auth.login(credentials, {
            provider: AuthProviders.Password,
            method: AuthMethods.Password,
        });
    }

    loginWithFacebook() {

        return Facebook.login(['email', 'public_profile', 'user_friends']).then(response => {
            console.log('Response: ' + JSON.stringify(response));

            let creds = firebase.auth.FacebookAuthProvider
                .credential(response.authResponse.accessToken);

            console.log('Login Credentials: ' + JSON.stringify(creds));

            let providerConfig = {
                provider: AuthProviders.Facebook,
                method: AuthMethods.OAuthToken,
                remember: 'default',
                scope: ['public_profile', 'email', 'user_friends']
            };

            this.af.auth.login(creds, providerConfig)
                .then((authData) => {
                    this.addUser(authData);
                    console.log('Firebase Login Success: ' + JSON.stringify(authData));

                }).catch( (err) => {
                    throw err.toString() + ', Firebase';
                });

        });

    }

    createUser(credentials) {
        /* Add user to users database */
        return this.af.auth.createUser(credentials);
    }

    addUser(_authData) {
        // Add email to user info
        firebase.auth().currentUser.updateProfile({
            displayName: _authData.auth.displayName,
            photoURL: _authData.auth.providerData[0].photoURL
        }).then((success) => {
                console.log('Login Success: ' + JSON.stringify(success));
            }).catch((error) => {
                console.log('Login Error: ' + JSON.stringify(error));
            });

        firebase.auth()
            .currentUser
            .updateEmail(_authData.auth.providerData[0].email)
            .then((success) => {
                console.log('Login Success: ' + JSON.stringify(success));
            }).catch((error) => {
                console.log('Login Error: ' + JSON.stringify(error));
            });

        console.log('Update Login: ' + JSON.stringify(firebase.auth().currentUser));
        if (firebase.auth().currentUser.displayName) {
            this.af.database.list('/athletes').update( _authData.auth.uid , {
                'displayName': _authData.auth.displayName,
                'email': _authData.auth.providerData[0].email,
                'photoUrl': _authData.auth.providerData[0].photoURL
            });
        }
    }
}
