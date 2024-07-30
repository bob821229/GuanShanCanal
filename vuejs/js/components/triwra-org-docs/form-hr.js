import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import {
  getDatabase, ref, onValue, set, push
  , query
  , equalTo
  , orderByChild
} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-database.js";

export default {
  inject: ['dialogRef'],
  data() {
    return {
      firebase: {
        app: null,
        db: null,
      },
      formData: null, 
    }
  },
  computed: {
    inputFormData() {
      this.formData = {
        formType: 'formType', 
        formName: `人事制度`,
        actDescription: ``,
        year: 2023,
        verifiedAtByBoardOfDirectors: null,
        checkNumberByIA: null,
        checkedAtByIA: null,
        attachmentList: []
      };
      if (this.dialogRef.data != null && this.dialogRef.data.formData != null) {
        //return 
        //_data = this.dialogRef.data.formData;
        Object.assign(this.formData, this.dialogRef.data.formData);
      }
      //console.log(_data);
      return this.formData;
    }
  },
  methods: {
    submit: function () {
      //console.log(this.inputFormData);
      //this.updateData();
      this.dialogRef.close(
        this.inputFormData
      );
    },
    init: function () {
      let firebaseConfig = {
        // ...
        // The value of `databaseURL` depends on the location of the database
        databaseURL: "https://vue-app-test-14344-default-rtdb.asia-southeast1.firebasedatabase.app/",
      };
      this.firebase.app = initializeApp(firebaseConfig);
      //let db = getDatabase(this.firebase.app);
    },
    updateData: function () {
      let db = getDatabase(this.firebase.app);

      let formData = this.inputFormData;
      
      let p = null;
      formData.updateDatetimeUtc = dayjs().format('YYYY-MM-DD HH:mm:ss');
      if (formData.key == null) {
        formData.ifEnable = true;
        p = push(ref(db, 'formHr'), formData);
      } else {
        p = set(ref(db, `formHr/${formData.key}`), formData);
      }
      p.then(
        (_para) => {
          console.log('insert/update successfully', _para);
        }
      ).catch(
        (err) => {
          console.log('errors on insert/update ', err);
        }
      );

    },
  },
  mounted() {
    console.log(this.dialogRef.data);
    this.init();
    
  },
  template: `
  <form>
      <h3>{{inputFormData.formName}}</h3>
      <div class="mb-3">
        <label for="exampleInputPassword1" class="form-label">法令依據</label>
        <input type="text" class="form-control"  id="" name="" v-model="inputFormData.actDescription">
      </div>
      <div class="mb-3">
        <label for="exampleInputPassword1" class="form-label">年度</label>
        <input type="text" class="form-control"  id="" name="" v-model="inputFormData.year">
      </div>
      <div class="mb-3">
        <label for="exampleInputPassword1" class="form-label">董事會通過日期</label>        
        <DatePicker v-model="inputFormData.verifiedAtByBoardOfDirectors" />
      </div>
      <div class="mb-3">
        <label for="exampleInputPassword1" class="form-label">主管機關備查字號</label>
        <input type="text" class="form-control"  id="" name="" v-model="inputFormData.checkNumberByIA">
      </div>
      <div class="mb-3">
        <label for="exampleInputPassword1" class="form-label">主管機關備查日期</label>
        <DatePicker v-model="inputFormData.checkedAtByIA" />
      </div>
      <div class="mb-3">
        <label for="exampleInputPassword1" class="form-label">附件</label>
        <input type="password" class="form-control" id="exampleInputPassword1">
      </div>
      <button type="button" class="btn btn-primary" @click="submit">完成</button>
    </form>
  `
};