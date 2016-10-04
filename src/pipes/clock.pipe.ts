import { Pipe } from '@angular/core';

@Pipe({
	name: 'clock',
	pure: false
 })
export class ClockPipe {
	transform(value): string {
		// Transform into minutes & seconds, Typescript forcing types here
		let minutes: number = Math.floor(value / 60);
		let seconds: number = Math.round(value % 60);
		let min: string;
		let sec: string;

		if (minutes < 10) {
			min = '0' + minutes;
		} else {
			min = '' + minutes;
		}
		if (seconds < 10) {
			sec = '0' + seconds;
		} else {
			sec = '' + seconds;
		}
		return '' + min + ':' + sec;
	}
}
