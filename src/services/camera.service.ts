import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Camera } from 'ionic-native';
import { StorageService } from './storage.service';
import { AuthService } from './auth.service';

declare var window: any;
declare var Zone: any;
declare var VideoEditor: any;

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
    // Workaround for filereader in ios
    if (this.platform.is('ios')) {
      const WrappedFileReader = window.FileReader
      window.FileReader = function OriginalFileReader(...args) {
        WrappedFileReader.apply(this, args)
        const originalInstance = this[Zone.__symbol__('originalInstance')] // eslint-disable-line

        return originalInstance || this
      }
    }

    return new Promise((resolve, reject) => {
      Camera.getPicture(this.options).then( (fileUri: any) => {
        console.log('File URI: ' + JSON.stringify(fileUri));
        // Add Prefix for android platform
        if (this.platform.is('android')) {
          fileUri = 'file://' + fileUri;
        }

        // find file type video or image
        const fileType = this._findFileType(fileUri);

        if (fileType.substring( 0, 5) === 'video') {
          this.createThumbnail(fileUri).catch( (error) => {
            console.log('Error Caught while creating thumbnail: ' + JSON.stringify(error));
            reject(error);
          }).then( (thumbnail) => {
            this.resolveLocalFile(resolve, reject, fileUri, thumbnail);
          });
        } else {
          this.resolveLocalFile(resolve, reject, fileUri, null);
        }
      }).catch( (error) => {
        console.log('Get Picture Error: ' , error);
        reject(error);
      });
    });
  }

  createThumbnail(fileUri: string): Promise<any> {
    return new Promise( ( resolve, reject ) => {
      console.log('Creating Thumbnail from: ' + JSON.stringify(fileUri));
      VideoEditor.createThumbnail(
        (fileUri) => { 
          console.log('Thumbnail Success: ' + JSON.stringify(fileUri));
          // Check for "file://"
          if (fileUri.substring(0,5) !== 'file:') {
            fileUri = 'file://' + fileUri;
          }

          this.resolveLocalFile( resolve, reject, fileUri, null );
        }, (error) => {
          console.log('Thumbnail Error: ' + JSON.stringify(error));
          reject(error);
        }, {
          fileUri: fileUri,
          outputFileName: 'thumbnailTmp',
          quality: 100
        });
    });
  }

  resolveLocalFile(resolve, reject, fileUri, thumbnail) {
     window.resolveLocalFileSystemURL(fileUri, (fileEntry) => {
         fileEntry.file( (file) => {
             // Create Thumbnail
             console.log('File: ' + (typeof file) + ', ' + JSON.stringify(file));
             this.readFile( resolve, reject, file, thumbnail);
           }, (error) => {
             console.log('File Entry Error: ' + JSON.stringify(error));
             reject(error);
           });
        }, (error) => {
          console.log('Error resolving file: ' + JSON.stringify(error));
          reject(error);
      });

  }

  readFile(resolve, reject, file, thumbnail) {
    const fileReader = new FileReader();
    // iOS giving null for file type
    if (file.type === null) {
       file.type = this._findFileType(file.name);
    }
               
   fileReader.onloadend = (result: any) => {
     console.log('File Reader Result: ' + JSON.stringify(result));
     // Create Thumbnail
     let arrayBuffer = result.target.result;
     let blob = new Blob([new Uint8Array(arrayBuffer)], {'type': '' + file.type});
     this.upload(blob, file.name , file.type, thumbnail, resolve, reject);
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

   fileReader.readAsArrayBuffer(file);
  }  

  upload(blob: Blob, name: string, type: string, thumbnail: any, resolve: any, reject: any) {
    console.log('Uploading: ' + JSON.stringify(name) + ' , type: ' + JSON.stringify(type));
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

  _findFileType(fileName: string): string {
    // Find the suffix (ex .mp4) and translate
    const suffix = fileName.substring(fileName.lastIndexOf('.'), fileName.length).toLowerCase();
    switch (suffix) {
      case ".mov":
        return 'video/mov';
      case ".mp4":
        return 'video/mp4';
      case ".jpg":
        return 'image/jpg';
      case ".jpeg":
        return 'image/jpeg';
      case ".png":
        return 'image/png';  
      default:
        return 'image';
    }
  }
}
