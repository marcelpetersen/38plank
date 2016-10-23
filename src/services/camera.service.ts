import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Camera } from 'ionic-native';
import { StorageService } from './storage.service';
import { AuthService } from './auth.service';

declare var window: any;
declare var Zone: any;
declare var VideoEditor: any;
declare var plugins: any;

@Injectable()
export class CameraService {

    // Ability to upload videos
  public options: any = {
        allowEdit: true,
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
            this._resolveLocalFile(resolve, reject, fileUri, thumbnail);
          });
        } else {
          // Images for android are cropped with seperate plugin
          if (this.platform.is('android')) {
            let options = {};
            plugins.crop.promise( fileUri, options).then( (path) => {
              console.log('Cropped Image Path: ' + JSON.stringify(path));
              this._resolveLocalFile(resolve, reject, path, null);
            }).catch((error) => {
              console.log('Error Cropping Android: ' + JSON.stringify(error));
              reject(error);
            });
          } else {
            // iOS Cropping handled natively with allowEdit option
            this._resolveLocalFile(resolve, reject, fileUri, null);
          }
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

          this._resolveLocalFile( resolve, reject, fileUri, null );
        }, (error) => {
          console.log('Thumbnail Error: ' + JSON.stringify(error));
          reject(error);
        }, {
          fileUri: fileUri,
          outputFileName: 'thumbnailTmp' + Date.now() + this.auth.id,
          quality: 100,
          width: 200,
          height: 200
        });
    });
  }

  _resolveLocalFile(resolve, reject, fileUri, thumbnail) {
     window.resolveLocalFileSystemURL(fileUri, (fileEntry) => {
         fileEntry.file( (file) => {
             // Create Thumbnail
             console.log('File: ' + (typeof file) + ', ' + JSON.stringify(file));
             this._readFile( resolve, reject, file, thumbnail);
           }, (error) => {
             console.log('File Entry Error: ' + JSON.stringify(error));
             reject(error);
           });
        }, (error) => {
          console.log('Error resolving file: ' + JSON.stringify(error));
          reject(error);
      });

  }

  _readFile(resolve, reject, file, thumbnail) {
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
     this.storage.upload(blob, file.name , file.type, thumbnail, resolve, reject);
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
