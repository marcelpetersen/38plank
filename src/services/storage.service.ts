import {Injectable} from '@angular/core';

@Injectable()
export class StorageService {
	public imageRef = firebase.storage().ref().child('images');
  public videoRef = firebase.storage().ref().child('videos');

	constructor() {

	}

	addBlob(name: string, type: string, blob: Blob, reject) {
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
        console.log('Type Not Supported');
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

  upload(blob: Blob, name: string, type: string, thumbnail: any, resolve: any, reject: any) {
   console.log('Uploading: ' + JSON.stringify(name) + ' , type: ' + JSON.stringify(type));
   let uploadTask = this.addBlob( name , type, blob, reject);
   uploadTask.on('state_changed' , (snapshot) => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
      }
    }, (error: any) => {
      console.log('An Error has occured');
      switch (error.code) {
        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          console.log('Unauthorized Access: ' + JSON.stringify(error));
          reject(error.code);
        case 'storage/canceled':
          // User canceled the upload
          console.log('Canceled');
          reject(error.code);
        case 'storage/unknown':
          // Unknown error occurred, inspect error.serverResponse
          console.log('Storage Unkown: ' + JSON.stringify(error));
          reject(error.code);
          break;
        default:
          console.log('Default: ' + JSON.stringify(error));
          reject(error.code);
          break;
      }
    }, () => {
      const uploadReturn = {
        url: uploadTask.snapshot.downloadURL,
        name: uploadTask.snapshot.metadata.name,
        mediaType: type
      };
      if (thumbnail) {
        // Only add thumbnail for videos
        uploadReturn['thumbnail'] = thumbnail;
      };
      console.log('Finished Uploading: ' + JSON.stringify(uploadReturn));
      resolve(uploadReturn);
    });
  }
}