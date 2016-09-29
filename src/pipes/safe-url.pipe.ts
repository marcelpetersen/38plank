import { Pipe } from '@angular/core';
import { DomSanitizationService } from '@angular/platform-browser';

@Pipe({ 
	name: 'safeUrl',
	pure: false
 })
export class SafeUrlPipe {
	constructor(private sanitizer: DomSanitizationService) {}

	transform(value) {
		return this.sanitizer.bypassSecurityTrustResourceUrl(value);
	}
}