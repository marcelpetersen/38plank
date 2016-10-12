import { Component, Input, OnInit } from '@angular/core';
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
  public 
  public items: FirebaseListObservable<any>;
  public error: any;

  constructor(
    public auth: AuthService,
    public movements: MovementService,
    public camera: CameraService
    ) {
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

  }

  playVideo(video: any): void {
    console.log('Play Video');
  }

}