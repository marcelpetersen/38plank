import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { FirebaseListObservable } from 'angularfire2';

import { AthleteService } from '../../services/athlete.service';

@Component({
  selector: 'athlete-search',
  templateUrl: 'athlete-search.comp.html'
})
export class AthleteSearchComponent implements OnInit {
  @Input() searchTerm: Subject<any>;
  public items: FirebaseListObservable<any>;

  constructor(public athletes: AthleteService) {
    console.log('Constructing Athlete Search');
  }

  ngOnInit() {
    // Start searching
    this.items = this.athletes.searchAthletesByUsername(this.searchTerm);
  }
  
}