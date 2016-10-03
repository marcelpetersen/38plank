import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Camera } from 'ionic-native';
import { StorageService } from './StorageService';
import { AuthService } from './AuthService';

@Injectable()
export class CameraService {

    constructor(public platform: Platform,
                public storage: StorageService,
                public auth: AuthService) {}

    getPicture(options) {
        return new Promise((resolve, reject) => {
          Camera.getPicture(options).then( (uri) => {
            window.resolveLocalFileSystemURL( uri , (fileEntry) => {

              fileEntry.file( (resFile) => {
                let reader = new FileReader();
                reader.onloadend = (event) => {
                  var imgBlob = new Blob( [event.target.result], {type: 'image/jpeg'});
                  imgBlob.name = '' + this.auth.id + (Date.now()) + '.jpg';

                  let upload = this.storage.addImage(imgBlob.name , imgBlob);
                  upload.on('state_changed' , (snapshot) => {
                    console.log('Image State Changed');
                  }, (err) => {
                      console.log('Upload Error');
                      reject(err);
                  } , () => {
                      let res = {img: imgBlob, url: upload.snapshot.downloadURL};
                      resolve(res);
                  });
                };
                reader.readAsArrayBuffer(resFile);
              });
            });
          }, (err) => {
              console.log('Camera Error');
              reject(err);
          }, options);
      });
    }
}
