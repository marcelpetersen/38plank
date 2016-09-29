import { Pipe } from '@angular/core';

@Pipe({
	name: 'clock',
	pure: false
 })
export class ClockPipe {
	transform(value) {
		// Transform into minutes & seconds
		let minutes = Math.floor(value / 60);
		let seconds = Math.round(value % 60);
		if (minutes < 10) {
			minutes = '0' + minutes;
		}
		if (seconds < 10) {
			seconds = '0' + seconds;
		}
		return '' + minutes + ':' + seconds;
	}
}
