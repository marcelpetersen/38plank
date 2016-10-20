import {Injectable} from '@angular/core';

@Injectable()
export class StorageService {
	public imageRef = firebase.storage().ref().child('images');
  public videoRef = firebase.storage().ref().child('videos');

	constructor() {

	}

	addBlob(name: string, type: string, blob: Blob) {
		switch (type) {
      case "image/jpg":
        return this.addImage(name, blob);
      case "image/jpeg":
        return this.addImage(name, blob);
      case "image/png":
        return this.addImage(name, blob);
      case "video/mp4":
        return this.addVideo(name, blob);
      case 'video/mov': 
        return this.addVideo(name, blob);
      default:
        console.log('No Type specified in blob addition');
        break;
    }
	}

  addImage(name: string, blob: Blob) {
    return this.imageRef.child(name).put(blob);
  }

  addVideo(name, blob) {
    return this.videoRef.child(name).put(blob);
  }

  addFile(name, file) {
    return this.imageRef.child(name).put(file);
  }
}