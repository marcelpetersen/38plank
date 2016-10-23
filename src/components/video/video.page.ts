import { Component, OnDestroy } from '@angular/core';
import { ViewController, NavParams, NavController } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';

@Component({
  templateUrl: 'video.page.html'
})
export class VideoPage implements OnDestroy {
  public video: any;
  public options: any;
  public showMenu: boolean = false;

  constructor(
    public viewCtrl: ViewController,
    public params: NavParams,
    public auth: AuthService,
    public nav: NavController
    ) {
    /* Two parameters, the image in question, and the source referencing it */
    this.video = this.params.get('video');
    this.options = this.params.get('options');
    console.log('Video: ' , this.video);
    console.log('Options: ' , this.options);

  }

  ngOnDestroy(): void {
    // Destroy video context for memory savings

  }

  delete() {
    console.log('delete');
    this.options.delete();
    this.nav.pop();
  }

  menu(): void {
    this.showMenu = !this.showMenu;
  }
}
