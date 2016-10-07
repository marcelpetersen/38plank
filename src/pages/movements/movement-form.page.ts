import { Component } from '@angular/core';
import { NavParams, NavController, AlertController, ModalController } from 'ionic-angular';
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
  public images: FirebaseListObservable<any>;
  public editable: boolean = false;
  public editing: boolean = false;
  public id: string;
  public error: any;

  constructor(public movements: MovementService,
              public auth: AuthService,
              public params: NavParams,
              public nav: NavController,
              public alertCtrl: AlertController,
              public modalCtrl: ModalController,
              public camera: CameraService,
              public actions: ActionService) {

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
    this.images = this.movements.getImages(this.id);
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

  deletePhoto(_image) {
    this.images.remove(_image.$key);
  }

  addImage() {
    /* Select and upload Image from service */

    this.camera.getPicture().then( (res: any): void => {
      let imageObj = {
        imageURL: res.url,
        name: res.img.name
      };
      this.images.push(imageObj);
    }).catch((error) => {
      console.warn('Error Occured' + JSON.stringify(error));
    });
  }

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

  imageOptions(img) {

    console.log('Image Options: ' , img);
    let modal = this.modalCtrl.create(ImageModal, {
      image: img,
      options: {
        thumbnail: () => {
          if (this.editable) {
            console.log(img);
            this.movement.update({
              thumbnail: {
                imageURL: img.imageURL,
                name: img.name
              }
            });
          }
        }
      }
    });
    modal.present(modal);
  }

  addVideo(): void {

  }

}
