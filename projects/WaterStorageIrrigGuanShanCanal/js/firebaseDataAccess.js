import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js'
import {
    getDatabase, ref, onValue, set, push
    , child
    , query
    , equalTo
    , orderByChild
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";

class FirebaseDataAccess {
    constructor() {
        let firebaseConfig = {
            apiKey: "AIzaSyBRGYWEvWWUK85aIsl0AZnrPXVJz320QuU",
            authDomain: "employeesystemproject.firebaseapp.com",
            databaseURL: "https://employeesystemproject-default-rtdb.firebaseio.com",
            projectId: "employeesystemproject",
            storageBucket: "employeesystemproject.appspot.com",
            messagingSenderId: "608429976922",
            appId: "1:608429976922:web:3fd6b682331174bce35763"
        };
        this.firebaseApp = initializeApp(firebaseConfig);
    }
    // updateData(formData) {
    //     if(formData == null){
    //         return;
    //     }
    //     console.log('udpateData', formData);
    //     //return;
    //     let db = getDatabase(this.firebaseApp);

    //     //let formData = this.inputFormData;

    //     let promise = null;
    //     formData.updateDatetimeUtc = dayjs().format('YYYY-MM-DD HH:mm:ss');
    //     //formData.organizationId = this.user.organizationId;
    //     if(formData.organizationId == null || formData.organizationId == undefined) formData.organizationId = this.user.organizationId;
    //     if (formData.key == null) {
    //         formData.ifEnable = true;
    //         //p = push(ref(db, 'organizationDocList'), formData);
    //         formData.key = push(child(ref(db), 'organizationDocList')).key;
    //     } else {
    //         //p = set(ref(db, `organizationDocList/${formData.key}`), formData);
    //     }
    //     promise = set(ref(db, `organizationDocList/${formData.key}`), formData);
    //     return promise;
    // };
    // deleteData(data) {
    //     console.log(data);
    //     //return;
    //     let db = getDatabase(this.firebaseApp);
    //     data.updateDatetimeUtc = dayjs().format('YYYY-MM-DD HH:mm:ss');
    //     data.ifEnable = false;
    //     let promise = set(ref(db, `organizationDocList/${data.key}`), data);
    //     return promise;
    // };
    // loadData(callback) {
    //     let _list = [];
    //     let db = getDatabase(this.firebaseApp);
    //     let databaseRef = ref(db, '/organizationDocList');
    //     databaseRef = query(databaseRef, orderByChild('ifEnable'), equalTo(true));

    //     onValue(databaseRef, (snapshot) => {
    //         snapshot.forEach((childSnapshot) => {
    //             const childKey = childSnapshot.key;
    //             const childData = childSnapshot.val();
    //             // ...
    //             console.log(childKey, childData);
    //             // let obj = {};
    //             // obj[childKey] = childData;
    //             if(this.user.role < 20 || (this.user.organizationId == childData.organizationId)){
    //                 childData.key = childKey;
    //                 _list.push(childData);
    //             }

    //         });
    //         callback(_list);
    //     }, {
    //         onlyOnce: true
    //     });
    // };
    getData(payload, callback) {
        let _list = [];
        let db = getDatabase(this.firebaseApp);
        let databaseRef = ref(db, payload.path);
        if (payload.key != null && payload.value != null) {
            databaseRef = query(databaseRef, orderByChild(payload.key), equalTo(payload.value));
        }

        onValue(databaseRef, (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                // ...
                childData.pkey = childKey;
                //console.log(childKey, childData);
                // let obj = {};
                // obj[childKey] = childData;
                _list.push(childData);

            });
            callback(_list);
        }, {
            onlyOnce: true
        });
    };
};

function firebaseDataAccess() {
    let a = new FirebaseDataAccess();
    return a;
}
export { firebaseDataAccess }