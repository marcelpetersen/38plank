import { Component, Input } from '@angular/core';

@Component({
  selector: 'content-grid',
  templateUrl: 'content-grid.comp.html'
})
export class ContentGridComponent {

  @Input() id: string;
  @Input() type: string;

  constructor() {
    }

}