import {Component} from '@angular/core';
import {ViewController, NavParams, Platform} from 'ionic-angular';
import {AuthService} from '../../services/AuthService';
import {Camera} from 'ionic-native';
import {CameraService} from '../../services/CameraService';
import {StorageService} from '../../services/StorageService';

@Component({
  templateUrl: 'image.modal.html'
})
export class ImageModal {
  public image: any;
  public options: any;
  public showMenu: boolean = false;

  constructor(
    public viewCtrl: ViewController,
    public params: NavParams,
    public platform: Platform,
    public auth: AuthService,
    public camera: CameraService,
    public storage: StorageService
    ) {
    /* Two parameters, the image in question, and the source referencing it */
    this.image = this.params.get('image');
    this.options = this.params.get('options');
    console.log('Image: ' , this.image);
    console.log('Options: ' , this.options);

  }

  close() {
    this.viewCtrl.dismiss();
  }

  delete() {
    console.log('delete');
    this.options.delete();
    this.viewCtrl.dismiss();
  }

  thumbnail() {
    this.options.thumbnail();
    this.viewCtrl.dismiss();
  }

  addPhoto() {
    /* Camera */
        /* Select and upload Image from service */
    let options = {
      sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
      mediaType: Camera.MediaType.PICTURE,
      allowEdit: true
    };

    this.camera.getPicture(options).then( (res: any): void => {
      console.log('Resolved' , res);
      let imageObj = {
        imageURL: res.url,
        name: res.img.name
      };
      this.options.addPhoto(imageObj);
    }).catch((error) => {
      console.warn('Image Error Occured: ' + JSON.stringify(error));
    });

  }

  menu() {
    // Show Menu
    this.showMenu = !this.showMenu;
  }
}
