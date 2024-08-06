import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js'

import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
  //listAll, 
  deleteObject
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-storage.js"

class FileUploader {
  constructor() {
    let firebaseConfig = {
      apiKey: "AIzaSyBtxn1Mu6lFTmXi61o5_91gBSvNT26RBho",
      authDomain: "vue-app-test-14344.firebaseapp.com",
      databaseURL: "https://vue-app-test-14344-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "vue-app-test-14344",
      storageBucket: "vue-app-test-14344.appspot.com",
      messagingSenderId: "686022331262",
      appId: "1:686022331262:web:d6d6311a79702fb095c12f"
    };
    this.firebaseApp = initializeApp(firebaseConfig);
    this.storage = getStorage(this.firebaseApp, "gs://vue-app-test-14344.appspot.com");
  }

  upload(_file, okCallback) {
    console.log('FileUploader upload');
    let fileAlias = _file.name;
    let fileName = fileAlias;

    let imgRef = storageRef(this.storage, `upload/${fileName}`);
    let uploadTask = uploadBytesResumable(imgRef, _file
      //, metadata
    );

    uploadTask.on('state_changed',
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        console.log('upload error', error);
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // console.log('File available at', downloadURL);
          // this.inputFormData.attachmentList.push(
          //   {
          //     fileAlias: fileAlias,
          //     url: downloadURL
          //   }
          // );
          if(okCallback != null){
            okCallback(downloadURL, fileAlias)
          }
        });
      }
    );
  }
}
function fileUploader(){
  let a = new FileUploader();
  return a;
}
export{fileUploader}