import { Component } from '@angular/core';
import { Platform, Events, ToastController, MenuController } from 'ionic-angular';
import { StatusBar, GoogleAnalytics, Splashscreen } from 'ionic-native';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/auth/login';
import { AngularFire } from 'angularfire2';

declare var mixpanel: any;

@Component({
  template: '<ion-nav hide-nav-bar="true" [root]="rootPage"></ion-nav>'
})
export class MyApp {
  rootPage: any = LoginPage;

  constructor(public platform: Platform,
              public events: Events,
              public toast: ToastController,
              public af: AngularFire,
              public menu: MenuController) {
    /* listen for login / logout event, change root page */
    this.platform = platform;
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      /* Cordova */
      Splashscreen.hide();
      StatusBar.styleDefault();
      GoogleAnalytics.startTrackerWithId('UA-75849044-2');
    });

    this.menu = menu;
  }

  ngAfterViewInit() {
    this.listenToLoginEvents();
    // this.listenForUpdates();
  }

  listenToLoginEvents() {

    this.af.auth.subscribe( (user) => {
      if (user) {
        // User is signed in.
        console.log('Firebase Auth: ' , user);
        this.rootPage = TabsPage;
      } else {
        // No user is signed in.
        console.log('Firebase Auth None');
        this.rootPage = LoginPage;
      }
    });
   }

   /* Update Disabled for the moment */
   /*
   listenForUpdates() {
     this.platform.resume.subscribe( () => {
       mixpanel.track('Resume');
       this.update();
     });
     this.platform.pause.subscribe( () => {
       mixpanel.track('Pause');
       console.log('Pause Load');
       this.deploy.getSnapshots().then( (data) => {
         console.log(JSON.stringify(data));
       });
       // Should think about the ux of a slight gap in loading
       this.deploy.load();
     });
   }

   update() {
     console.log('Looking for updates');
     this.deploy.check().then( (snapshotAvailable: boolean) => {
        if (snapshotAvailable) {
          console.log('Updating Version');
          this.deploy.download().then( () => {
            console.log('Download Succesful');
            this.deploy.extract().then( () => {
              // this.deploy.load();
              console.log('Extract Succesful');
            }, (error) => {
              console.warn('Error Extracting Deployment', error);
            });
          }, (err) => {
            console.warn('Error Downloading Deployment' , err);
          });
        } else {
          console.log('Snapshot Not Available');
        }
      }, (error) => {
        console.warn('Error checking deployment', error);
      });
   }
   */
}