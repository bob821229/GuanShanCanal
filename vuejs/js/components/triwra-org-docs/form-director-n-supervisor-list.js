const { useVuelidate } = Vuelidate;
const { required, email, helpers } = VuelidateValidators;

export default {
  inject: ['dialogRef', 'organizationList', 'user'
    , 'fileUploader'
  ],
  setup() {
      return { v$: useVuelidate() }
  },
  validations() {
    return {
      formData: {
            year: { required: helpers.withMessage('必填', required) },
            version: { required: helpers.withMessage('必填', required) },
            session: { required: helpers.withMessage('必填', required) },
            sessionPeriod: { required: helpers.withMessage('必填', required) },
            organizationId: { ifValidOrganizationId: helpers.withMessage('必填', ifValidOrganizationId) },
            attachmentList: { 
                ifAnyItem: helpers.withMessage('至少上傳一個檔案', ifAnyCollection)
            },
      }, 
    }
  },
  data() {
    return {
      formData: null, 
      // verifiedAtByBoardOfDirectors: null, 
      // checkedAtByIA: null, 
    }
  },
  watch: {
    // 'formData.verifiedAtByBoardOfDirectors': function(n, o){
    //   console.log('formData.verifiedAtByBoardOfDirectors', o, n);
    //   if(n != null){
    //     this.verifiedAtByBoardOfDirectors = n;
    //   }
    // },
    // 'formData.checkedAtByIA': function(n, o){
    //   console.log('formData.checkedAtByIA', o, n);
    //   if(n != null){
    //     this.checkedAtByIA = n;
    //   }
    // }
  }, 
  computed: {
    inputFormData() {
      this.formData = {
        organizationId: null,
        formType: 'formType', 
        //formName: `人事制度`,
        actDescription: ``,
        year: null,
        session: null,
        version: null,
        sessionPeriod: null,
        comment: null,
        attachmentList: [
          //{fileAlias: 'a', url: '#'}, {fileAlias: 'b', url: '#'}, {fileAlias: 'c', url: '#'}, {fileAlias: 'd', url: '#'}
        ], 
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
    submit: async function (e) {
      e.preventDefault();
      
      let isFormCorrect = await this.v$.$validate()
      if(!isFormCorrect){
        alert('請完整填寫表單');
        return;
      }
      console.log(isFormCorrect, this.inputFormData);
      //this.updateData();
      this.dialogRef.close(
        this.inputFormData
      );
    },
    init: function () {
    },
    onMyUpload: async function(event) {
      console.log(event);
      console.log('onUpload');
      
      let _file = event.files[0];
      
      this.fileUploader.upload(_file, 
        (downloadURL, fileAlias) => {
          console.log('File uploaded by file uploader available at', downloadURL);
          this.inputFormData.attachmentList.push(
            {
              fileAlias: fileAlias, 
              url: downloadURL
            }
          );
        }
      );
    }, 
    removeFile: function(idx){
      if(confirm('確定移除該檔案？')){
        this.formData.attachmentList.splice(idx, 1);
      }
    }, 
    handleInput: function(e, data){
      console.log('handleInput');
      console.log(e);
      console.log(data);
      data = dayjs(e).format('YYYY-MM-DD');
    }, 
  },
  mounted() {
    console.log(this.dialogRef.data);
    this.init();
    
  },
  template: `
  <form>
      <!--{{user}} {{organizationList}}-->
      <!--<h3>{{inputFormData.formName}}</h3>-->
      <!--  {{user}} {{organizationList}} -->
      <!--
      <div class="mb-3">
        <label for="exampleInputPassword1" class="form-label">法令依據</label>
        <input type="text" class="form-control" id="" name="" v-model="inputFormData.actDescription" disabled>
      </div>
      -->
      <div class="mb-3" v-if="user.role < 20">
        <label for="exampleInputPassword1" class="form-label required">財團法人：</label>
        <select class="form-select" v-model="inputFormData.organizationId">
            <option v-for="(obj, idx) in organizationList" :value="obj.organizationId">{{obj.name}}</option>
        </select>
        <p v-for="error of v$.formData.organizationId.$errors"
            :key="error.$uid" class="text-danger">
            <strong>{{ error.$message }}</strong>
        </p>
      </div>
      <div class="mb-3">
        <label for="exampleInputPassword1" class="form-label required">年度</label>
        <input type="number" class="form-control" id="" name="" v-model="inputFormData.year">
        <p v-for="error of v$.formData.year.$errors"
            :key="error.$uid" class="text-danger">
            <strong>{{ error.$message }}</strong>
        </p>
      </div>
      <div class="mb-3">
        <label for="exampleInputPassword1" class="form-label required">屆次</label>
        <input type="text" class="form-control" id="" name="" v-model="inputFormData.session">
        <p v-for="error of v$.formData.session.$errors"
            :key="error.$uid" class="text-danger">
            <strong>{{ error.$message }}</strong>
        </p>
      </div>
      <div class="mb-3">
        <label for="exampleInputPassword1" class="form-label required">版次</label>
        <input type="text" class="form-control" id="" name="" v-model="inputFormData.version">
        <p v-for="error of v$.formData.version.$errors"
            :key="error.$uid" class="text-danger">
            <strong>{{ error.$message }}</strong>
        </p>
      </div>
      <div class="mb-3">
        <label for="exampleInputPassword1" class="form-label required">本屆任期</label>
        <input type="text" class="form-control" id="" name="" v-model="inputFormData.sessionPeriod">
        <p v-for="error of v$.formData.sessionPeriod.$errors"
            :key="error.$uid" class="text-danger">
            <strong>{{ error.$message }}</strong>
        </p>
      </div>
      <div class="mb-3">
        <label for="exampleInputPassword1" class="form-label">備註：</label>
        <TextArea class="form-control" v-model="inputFormData.comment" rows="5" placeholder=""></TextArea>
      </div>
      <div class="mb-3">
        <label for="exampleInputPassword1" class="form-label required">附件</label>

        

        <div class="row">
          <div class="col-md-4 col-sm-12 my-1">
            <Card>
              <template #content>
                  <p class="m-0">
                    <FileUpload name="fileList" 
                      @uploader="onMyUpload($event)"
                      :customUpload="true"
                      :auto="true" 
                      :multiple="true"
                      :maxFileSize="1000000"
                      accept=".pdf,.docx,.doc,.png,.jpg,.gif"
                      :showUploadButton="false" 
                      :showCancelButton="false" 
                      chooseLabel="選取檔案"
                      invalidFileTypeMessage="只接受以下檔案：{0}"
                      invalidFileSizeMessage="檔案大小超過：{0}">
                        <template #empty>
                            <span>拖拽要上傳的檔案到此處</span>
                        </template>
                        <template #content>
                            <span></span>
                        </template>
                    </FileUpload>
                  </p>
              </template>
              
            </Card>
          </div>
          <div class="col-md-4 col-sm-12 my-1" v-for="(obj, idx) in inputFormData.attachmentList" :key="obj.key">
            <Card>
                <template #content>
                    <p class="m-0">
                        <a :href="obj.url" target="_target">{{obj.fileAlias}}</a>
                    </p>
                </template>
                <template #footer>
                  <div class="flex gap-4 mt-1">
                      <a @click="removeFile(idx)"> <i class="fa-solid fa-trash text-danger"></i> </a>
                  </div>
              </template>
            </Card>  

          </div>
          <p v-for="error of v$.formData.attachmentList.$errors"
              :key="error.$uid" class="text-danger">
              <strong>{{ error.$message }}</strong>
          </p>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <p>備註：應一併上傳相關核定函附件</p>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <button type="button" class="btn btn-primary" @click="submit">完成</button>
        </div>
      </div>

    </form>
  `
};