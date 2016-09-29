import { Component, Input, Output } from '@angular/core';
import { ProgramService } from '../../services/program.service';

@Component({
  selector: 'calendar',
  templateUrl: 'calendar.comp.html'
})
export class CalendarComp implements OnInit {
  @Input() programId: string;
  @Output() dateSelected: any;

  public selectedDay: any;
  public day: string;
  public month: string;
  public year: any;
  public monthDateStart: string;
  public calendar: Array< Array<any>> = [[], [], [], [], [], []];
  days_label: Array<string> = [
    'Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'
  ];
  months_label: Array<string> = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'
  ];
  days_in_month: Array<number> = [
    31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31
  ];
  current_date = new Date();


  constructor(public programs: ProgramService) {
  	// Program is list of workouts, at certain dates / times
  	// Gonna need a lot of help from the date object!
    this.bootstrap();
  }

  ngOnInit() {
  	// Subscribe to program
    this.programs.getProgram(this.programId).subscribe( (data) => {
      this.markCalendar(data.workouts);
    });
  }

  selectDay(day) {
    this.selectedDay = day;
  }

  markCalendar(workList: Array<any>) {
    Object.keys(workList).forEach( (key) => {
      let workoutObj = workList[key];
      if (workoutObj.hasOwnProperty('date')) {
        this.calendar.forEach( (week, w) => {
          week.forEach( (day, d) => {
        // Compare Dates
            console.log(workoutObj, 'Workoutobj');
            console.log('Current Date', day.date.getTime() );
            let timeDifference = workoutObj.date - day.date.getTime();
            if (timeDifference < 86400000 && timeDifference >= 0 ) {
              console.log('Found Day!', w , d);
              this.calendar[w][d]['workout'] = true;
            }
          });
        });
      }
    });
  }

  bootstrap() {

    this.month = this.current_date.getMonth();
    this.year = this.current_date.getFullYear();
    this.firstDay = new Date(this.year , this.month, 1);
    this.startingDay = this.firstDay.getDay();
    this.monthLength = this.days_in_month[this.month];
    // Compensate for leap year
    if (this.month === 1) { // February only!
      if ((this.year % 4 === 0 && this.year % 100 !== 0) || this.year % 400 === 0) {
        this.monthLength = 29;
      }
    }

    // Generate Calendar Array
    for (let w = 0; w * 7 < this.monthLength; w++) {
      for (let d = 0; d < 7; d++) {
        if ( w === 0 && d <= this.startingDay) {
          // First week has days that are from the last month
          this.calendar[w][d] = {date: (new Date(this.year, this.month - 1, this.days_in_month[this.month - 1] - this.startingDay + d)), workout: false};
        } else {
          this.calendar[w][d] = {date: (new Date(this.year, this.month, w * 7 + d - this.startingDay)), workout: false};
        }
      }
    }

    // Now we have our 2d array of javascript date objects!
    console.log('Calendar: ' , this.calendar);

  }
}
