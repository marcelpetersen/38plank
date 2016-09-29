import { Pipe } from '@angular/core';

@Pipe({
	name: 'propertyFormat',
	pure: false
 })
export class PropertiesFormatter {
	// Thoughts on changing based on settings? Don't want to make http requests

	transform(val , arg1) {
		if (arg1) {
			switch (arg1) {
				case 'weight':
					return val + 'lbs';
				case 'repetitions':
					return 'x' + val;
				case 'time':
					return val + 's';
				case 'distance':
					return val + 'm';
				default:
					return val;
			}
		}
		return val;
	}
}
