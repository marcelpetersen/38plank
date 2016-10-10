import {Injectable} from '@angular/core';

@Injectable()
export class StorageService {
	public imageRef = firebase.storage().ref().child('images');

	constructor() {

	}

	addImage(name, img) {
		return this.imageRef.child(name).put(img);
	}

  addFile(name, file) {
    return this.imageRef.child(name).put(file);
  }
}