import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Camera } from 'ionic-native';
import { StorageService } from './storage.service';
import { AuthService } from './auth.service';

declare var window: any;

@Injectable()
export class CameraService {

    public options: any = {
          sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
          mediaType: Camera.MediaType.PICTURE,
          destinationType: Camera.DestinationType.DATA_URL
    }

    constructor(public platform: Platform,
                public storage: StorageService,
                public auth: AuthService) {}

    getPicture(): Promise<any> {
      return new Promise( (resolve, reject): void => {
        Camera.getPicture(this.options).then( (base64: any) => {
          // Create Blob
          const contentType = 'image/jpeg';
          const blob = this.b64toBlob(base64, contentType);
          const name = '' + this.auth.id + (Date.now() + '.jpg');

          // Upload blob
          let uploadTask = this.storage.addImage( name , blob);

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
                break;
              case 'storage/canceled':
                // User canceled the upload
                console.log('Canceled');
                reject(error.code);
                break;
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
            console.log('Finished Uploading');
            resolve( uploadTask.snapshot.downloadURL );
          });
        }).catch( (error) => {
          console.log('Camera Error: ' + JSON.stringify(error));
          reject(error);
        });
      });
    }

  b64toBlob(b64Data, contentType='', sliceSize=512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      
      byteArrays.push(byteArray);
    }
    
    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }


}