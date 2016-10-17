import { Pipe } from '@angular/core';

@Pipe({ 
	name: 'safeUrl',
	pure: false
 })
export class SafeUrlPipe {
	constructor() {}

	transform(value) {
    return value;
	}
}