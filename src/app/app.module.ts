import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';

// Pages
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/auth/login';
import { DiscoverPage } from '../pages/discover/discover.page';
import { MovementDetailsPage } from '../pages/movements/movement-details.page';
import { MovementForm } from '../pages/movements/movement-form.page';
import { MovementListPage } from '../pages/movements/movement-list.page';
import { ProgramPage } from '../pages/program/program.page';
import { SettingsPage } from '../pages/settings/settings.page';
import { WorkoutForm } from '../pages/workout/workoutForm';
import { UserPage } from '../pages/user/user';
import { VideoPage } from '../components/video/video.page';

// Components
import { ActionComponent } from '../components/action/action.comp';
import { CalendarComp } from '../components/calendar/calendar.comp';
import { ComplexMovementsComponent } from '../components/complex/complex-movements.comp';
import { ExerciseComponent } from '../components/exercise/exercise.comp';
import { ImageModal } from '../components/image/image.modal';
import { LeaderboardComponent } from '../components/leaderboard/leaderboard.comp';
import { SearchMovements } from '../components/movement/movement-search.modal';
import { MovementComponent } from '../components/movement/movement.comp';
import { PercentCalcComponent } from '../components/percentCalculator/percent-calc';
import { PropertiesChange } from '../components/properties/properties-change.modal';
import { ResultComponent } from '../components/result/result.comp';
import { ResultPage } from '../components/result/result.page';
import { UserNameModal } from '../components/username/username.modal';
import { CompletionWorkout } from '../components/workout/completion-workout.comp';
import { WorkoutCardComponent } from '../components/workout/workout-card.comp';
import { WorkoutComponent } from '../components/workout/workout.comp';
import { ContentGridComponent } from '../components/content/content-grid.comp';
import { WorkoutSearchComponent } from '../components/workout/workout-search.comp';
import { AthleteSearchComponent } from '../components/athlete/athlete-search.comp';

// Services
import { ActionService } from '../services/action.service';
import { AnalyticsService } from '../services/analytics.service';
import { AthleteService } from '../services/athlete.service';
import { AuthService } from '../services/auth.service';
import { CameraService } from '../services/camera.service';
import { ComplexService } from '../services/complex.service';
import { ExerciseService } from '../services/exercise.service';
import { MovementService } from '../services/movement.service';
import { ProgramService } from '../services/program.service';
import { ResultService } from '../services/result.service';
import { StorageService } from '../services/storage.service';
import { WorkoutService } from '../services/workout.service';

// Pipes
import { IntegerPipe } from '../pipes/integer.pipe';
import { PropertiesFormatter } from '../pipes/property-formatter.pipe';
import { ReversePipe } from '../pipes/reverse.pipe';
import { ClockPipe } from '../pipes/clock.pipe';


// AngularFire2
import { AngularFireModule } from 'angularfire2';

// Must export the config
export const firebaseConfig = {
        apiKey: 'AIzaSyBwxrtC3SDwiW2sYidYT60eqd2vZWL3BbY',
        authDomain: 'popping-inferno-7577.firebaseapp.com',
        databaseURL: 'https://popping-inferno-7577.firebaseio.com',
        storageBucket: 'popping-inferno-7577.appspot.com'
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage,
    LoginPage,
    DiscoverPage,
    MovementDetailsPage,
    MovementForm,
    MovementListPage,
    ProgramPage,
    SettingsPage,
    UserPage,
    VideoPage,
    WorkoutForm,
    ActionComponent,
    CalendarComp,
    ComplexMovementsComponent,
    ExerciseComponent,
    ImageModal,
    LeaderboardComponent,
    SearchMovements,
    MovementComponent,
    PercentCalcComponent,
    PropertiesChange,
    ResultComponent,
    ResultPage,
    UserNameModal,
    CompletionWorkout,
    WorkoutCardComponent,
    WorkoutComponent,
    ContentGridComponent,
    WorkoutSearchComponent,
    AthleteSearchComponent,
    IntegerPipe,
    PropertiesFormatter,
    ReversePipe,
    ClockPipe
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage,
    LoginPage,
    DiscoverPage,
    MovementDetailsPage,
    MovementForm,
    MovementListPage,
    ProgramPage,
    SettingsPage,
    UserPage,
    VideoPage,
    WorkoutForm,
    ActionComponent,
    CalendarComp,
    ComplexMovementsComponent,
    ExerciseComponent,
    ImageModal,
    LeaderboardComponent,
    SearchMovements,
    MovementComponent,
    PercentCalcComponent,
    PropertiesChange,
    ResultComponent,
    ResultPage,
    UserNameModal,
    CompletionWorkout,
    WorkoutCardComponent,
    WorkoutComponent
  ],
  providers: [
    ActionService,
    AnalyticsService,
    AthleteService,
    AuthService,
    CameraService,
    ComplexService,
    ExerciseService,
    MovementService,
    ProgramService,
    ResultService,
    StorageService,
    WorkoutService
  ]
})
export class AppModule {}
