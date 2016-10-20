import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Camera } from 'ionic-native';
import { StorageService } from './storage.service';
import { AuthService } from './auth.service';

declare var window: any;
declare var Zone: any;

@Injectable()
export class CameraService {

    // Ability to upload videos
    public options: any = {
          sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
          mediaType: Camera.MediaType.ALLMEDIA,
          destinationType: Camera.DestinationType.FILE_URI
    }

    constructor(public platform: Platform,
                public storage: StorageService,
                public auth: AuthService) {}

    getMedia(): Promise<any> {
      // Workaround for filereader
      const WrappedFileReader = window.FileReader
      window.FileReader = function OriginalFileReader(...args) {
        WrappedFileReader.apply(this, args)
        const originalInstance = this[Zone.__symbol__('originalInstance')] // eslint-disable-line

        return originalInstance || this
      }

      return new Promise((resolve, reject) => {
        Camera.getPicture(this.options).then( (fileUri: any) => {
          console.log('File URI: ' + JSON.stringify(fileUri));
          // Add Prefix for android platform
          if (this.platform.is('android')) {
            fileUri = 'file://' + fileUri;
          }
          this.resolveLocalFile(resolve, reject, fileUri);
        }).catch( (error) => {
          console.log('Get Picture Error: ' , error);
          reject(error);
        });
      });
    }

  resolveLocalFile(resolve, reject, fileUri) {
     window.resolveLocalFileSystemURL(fileUri, (fileEntry) => {
       console.log('Type: ' + (typeof fileEntry));
         fileEntry.file( (file) => {
             console.log('File: ' + (typeof file) + ', ' + JSON.stringify(file));
             this.readFile( resolve, reject, file);
           }, (error) => {
             console.log('File Entry Error: ' + JSON.stringify(error));
             reject(error);
           });
        }, (error) => {
          console.log('Error resolving file: ' + JSON.stringify(error));
          reject(error);
      });

  }

  readFile(resolve, reject, file) {
    const fileReader = new FileReader();
    // iOS giving null for file type
    if (file.type === null) {
       file.type = 'video/mov';
    }
               
   fileReader.onloadend = (result: any) => {
     console.log('File Reader Result: ' + JSON.stringify(result));
     // Create Thumbnail
     let arrayBuffer = result.target.result;
     this.createThumbnail(arrayBuffer);
     let blob = new Blob([new Uint8Array(arrayBuffer)], {type: file.type});
     const name = '' + Date.now() + this.auth.id;
     this.upload(blob, name , file.type, resolve, reject);
   };

   fileReader.onloadstart = () => {
     console.log('On Load Start');
   };

   fileReader.onerror = (error: any) => {
     console.log('FileReader Error' + JSON.stringify(error));
     reject(error);
   };

   fileReader.onload = function() {
     console.log('onload');
   };

   console.log('FileReader reading: ' , fileReader);
   fileReader.readAsArrayBuffer(file);
  }  

  upload(blob: Blob, name: string, type: string, resolve: any, reject: any) {
    let uploadTask = this.storage.addBlob( name , type, blob);
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
            resolve( {url: uploadTask.snapshot.downloadURL, name: name, mediaType: type} );
          });
  }

  createThumbnail(arrayBuffer: any): string {
    return '';
  }

  _arrayBufferToBase64( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
  }
}
