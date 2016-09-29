import { NavController, ModalController, ToastController } from 'ionic-angular';
import { Component } from '@angular/core';
import { WorkoutForm } from '../workout/workoutForm';
import { HomePage } from '../home/home';
import { UserPage } from '../user/user';
import { MovementListPage } from '../movements/movement-list.page';
import { DiscoverPage } from '../discover/discover.page';
import { ProgramPage } from '../program/program.page';
import { MovementForm } from '../movements/movement-form.page';
import { UserNameModal } from '../../components/username/username.modal';
import { AuthService } from '../../services/AuthService';
import { AthleteService } from '../../services/AthleteService';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = DiscoverPage;
  tab3Root: any = ProgramPage;
  tab4Root: any = MovementListPage;
  tab5Root: any = UserPage;

  public showMenu: boolean = false;

  constructor(private nav: NavController,
              public toast: ToastController,
              public auth: AuthService,
              public athletes: AthleteService,
              public modalCtrl: ModalController) {
  }

  ionViewDidEnter() {
    /* Auth available */
    this.athletes.getAthlete(this.auth.id).first().subscribe( (data) => {
      if (!data.username) {
        let usernameModal = this.modalCtrl.create(UserNameModal);
        usernameModal.present();
      }
    });
  }

  addMenu() {
	  console.log('add menu');
	  this.showMenu = !this.showMenu;
  }

  createWorkout() {
  	  /* Doesnt need to toggle */
	  this.showMenu = false;
	  this.nav.push(WorkoutForm, {editable: true});
  }

  createMovement() {
    this.showMenu = false;
    this.nav.push(MovementForm);
  }

}
