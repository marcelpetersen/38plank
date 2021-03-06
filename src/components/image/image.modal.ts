import {Component} from '@angular/core';
import {ViewController, NavParams, Platform} from 'ionic-angular';
import {AuthService} from '../../services/auth.service';
import {CameraService} from '../../services/camera.service';
import {StorageService} from '../../services/storage.service';

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

  menu() {
    // Show Menu
    this.showMenu = !this.showMenu;
  }
}
