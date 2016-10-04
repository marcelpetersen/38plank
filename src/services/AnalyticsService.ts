import { Injectable } from '@angular/core';
import { GoogleAnalytics } from 'ionic-native';

@Injectable()
export class AnalyticsService {

    constructor() {}

    logEvent(event: any) {
    	console.log('Event Logged');
    	GoogleAnalytics.trackEvent(event.type, event.properties);
    }

    trackView(page, url) {
    	console.log('View Logged');
    	GoogleAnalytics.trackView(page , url);
    }
}
