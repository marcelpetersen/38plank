import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { ImageModal } from '../image/image.modal';
import { VideoPage } from '../video/video.page';
import { MovementService } from '../../services/movement.service';
import { AuthService } from '../../services/auth.service';
import { CameraService } from '../../services/camera.service';
import { FirebaseListObservable } from 'angularfire2';

@Component({
  selector: 'content-grid',
  templateUrl: 'content-grid.comp.html'
})
export class ContentGridComponent implements OnInit {

  @Input() id: string;
  @Input() type: string;
  public items: FirebaseListObservable<any>;
  public error: any;

  constructor(
    public auth: AuthService,
    public movements: MovementService,
    public camera: CameraService,
    public modalController: ModalController ) {
  }

  ngOnInit(): void {
    switch (this.type) {
      case "movement":
        console.log('Getting Movement Content: ' + JSON.stringify(this.id));
        this.items = this.movements.getMovementMedia(this.id);
        break;
      default:
        console.log('No movement type');
        break;
    }
  }

  showImage(img: any): void {
    // Image Modal!
    let imageModal = this.modalController.create(ImageModal, {image: img});
    imageModal.present();
  }

  playVideo(v: any): void {
    console.log('Play Video');
    let videoModal = this.modalController.create(VideoPage, {video: v});
    videoModal.present();
  }

}