import { Component } from '@angular/core';
import { NavParams, NavController, AlertController, ModalController, LoadingController } from 'ionic-angular';
import { FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
import { MovementService } from '../../services/movement.service';
import { AuthService } from '../../services/auth.service';
import { Movement } from '../../model/movement';
import { Action } from '../../model/action';
import { ImageModal } from '../../components/image/image.modal';
import { CameraService } from '../../services/camera.service';
import { ActionService } from '../../services/action.service';

@Component({
  templateUrl: 'movement-form.page.html'
})
export class MovementForm {
  public movement: FirebaseObjectObservable<Movement>;
  public onPlaying: boolean = false;
  public media: FirebaseListObservable<any>;
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
    this.media = this.movements.getMovementMedia(this.id);
    this.media.subscribe( (data) => {
      console.log('Media List: ' + JSON.stringify(data));
    });
    this.movement.first().subscribe( (move) => {
      if (move.createdBy === this.auth.id) {
        this.editable = true;
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

  addContent():void {
    let loader = this.loadingCtrl.create({
      content:'Uploading...'
    });
    loader.present();
    this.camera.getMedia().catch( (error) => {
      console.log('Get Media Error: ' + JSON.stringify(error));
      this.error = error;
      loader.dismiss();
    }).then( (media: any) => {
      console.log('Upload Succeded' + JSON.stringify(media));
      // Add Media to media list
      this.media.push(media);
      loader.dismiss();
    });
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
