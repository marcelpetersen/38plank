import {Component} from '@angular/core';
import {ViewController, NavParams } from 'ionic-angular';
import {AuthService} from '../../services/auth.service';

@Component({
  templateUrl: 'video.page.html'
})
export class VideoPage {
  public video: any;
  public options: any;

  constructor(
    public viewCtrl: ViewController,
    public params: NavParams,
    public auth: AuthService
    ) {
    /* Two parameters, the image in question, and the source referencing it */
    this.video = this.params.get('video');
    this.options = this.params.get('options');
    console.log('Video: ' , this.video);
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
}
