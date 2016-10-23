import { Component } from '@angular/core';
import { NavParams, NavController, AlertController, ModalController, LoadingController } from 'ionic-angular';
import { Toast } from 'ionic-native';
import { FirebaseObjectObservable } from 'angularfire2';
import { MovementService } from '../../services/movement.service';
import { AuthService } from '../../services/auth.service';
import { Movement } from '../../model/movement';
import { Action } from '../../model/action';
import { CameraService } from '../../services/camera.service';
import { ActionService } from '../../services/action.service';

@Component({
  templateUrl: 'movement-form.page.html'
})
export class MovementForm {
  public movement: FirebaseObjectObservable<Movement>;
  public video: FirebaseObjectObservable<any>;
  public onPlaying: boolean = false;
  public editable: boolean = false;
  public editing: boolean = false;
  public id: string;
  public error: any;
  public loading: boolean = false;

  constructor(public movements: MovementService,
              public auth: AuthService,
              public params: NavParams,
              public nav: NavController,
              public alertCtrl: AlertController,
              public modalCtrl: ModalController,
              public camera: CameraService,
              public actions: ActionService,
              public loadingCtrl: LoadingController) {

    if (this.params && this.params.get('movementId')) {
      this.id = this.params.get('movementId');
    } else {
      const promise: any = this.movements.createMovement(new Movement({ createdBy: this.auth.id }))
      this.id = promise.key;
      console.log('id', this.id);
      promise.then( (success) => {
        console.log('Created Movement: ' + success);
      }).catch( (error) => {
        console.warn('Error Creating Movement: ' + JSON.stringify(error));
        this.error = error;
      });
      this.addAction();
      this.editing = true;
    }

    this.movement = this.movements.getMovement(this.id);
    this.video = this.movements.getVideo(this.id);
    this.video.subscribe( (video) => {
      console.log('video change' + JSON.stringify(video));
    });
    this.movement.first().subscribe( (move) => {
      if (move.createdBy === this.auth.id) {
        this.editable = true;
      }
    });

  }

  changeVideo(): void {
    let loader = this.loadingCtrl.create({
      content:'Uploading...'
    });
    loader.present();
    this.camera.getMedia().catch( (error) => {
      console.log('Get Media Error: ' + JSON.stringify(error));
      loader.dismiss();
      Toast.show("Error Uploading Video: " + error, '5000', 'center');
    }).then( (newVideo: any) => {
      if (newVideo) {
        console.log('Upload Succeded' + JSON.stringify(newVideo));
        // Add Media to media list
        this.video.set(newVideo).catch( (error) => {
          console.warn('Error inseting media into database: ' + JSON.stringify(error));
          this.error = error;
        });
        loader.dismiss();
      }
    });
  }

  addAction() {
    let act = new Action({
      action: 'Created',
      createdBy: this.auth.id,
      actionOnType: 'Movement',
      actionOnId: this.id,
    });

    this.actions.logAction(act);
  }

  updateName($event) {
    console.log($event.target.value, ' Updating Name');
    this.movement.update({name: $event.target.value});
  }

  edit() {
    this.editing = true;
  }

  save() {
    this.editing = false;
  }

  delete() {
    this.movements.deleteMovement(this.id);
    this.nav.pop();
  }
  // Should be refactored into movement.comp
  changeCategory() {

    /* Think about componentizing this */
    let categoryAlert = this.alertCtrl.create();
    console.log('Change Category: ' , categoryAlert, this.alertCtrl);

    categoryAlert.setTitle('Select Category');
    categoryAlert.addInput({
      type: 'radio',
      label: 'Custom',
      value: 'Custom'
    });

    categoryAlert.addInput({
      type: 'radio',
      label: 'Weightlifting',
      value: 'Weightlifting'
    });

    categoryAlert.addInput({
      type: 'radio',
      label: 'Monostructural',
      value: 'Monostructural'
    });

    categoryAlert.addInput({
      type: 'radio',
      label: 'Gymnastics',
      value: 'Gymnastics'
    });

    categoryAlert.addButton('Cancel');
    categoryAlert.addButton({
      text: 'Set',
      handler: (data) => {
        this.movement.update({type: data});
      }
    });

    categoryAlert.present(categoryAlert);
  }

}
