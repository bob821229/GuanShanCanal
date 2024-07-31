import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js'
import {
    getDatabase, ref, onValue, set, push
    , query
    , equalTo
    , orderByChild
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";

import FormHr from '../../components/triwra-org-docs/form-hr.js'
import FormIntegrity from '../../components/triwra-org-docs/form-integrity.js'

export default {
    components: {
        FormHr,
        FormIntegrity,
    },
    mounted() {
        this.init();
        this.loadData();
    },
    data() {
        return {
            visible: false,
            docList: [

            ],
            formList: [
                {formName: '人事制度', formType: 'formHr', componentName: 'FormHr'}, 
                {formName: '誠信經營規範', formType: 'formIntegrity', componentName: 'FormIntegrity'}, 
            ], 
            firebase: {
                app: null,
                db: null,
            },
            form2New: ``,
        }
    },
    computed: {
        formListData(){
            this.formList.forEach(obj => {
                obj.comp = eval(obj.componentName)
            });
            return this.formList;
        }
    }, 
    methods: {
        newForm: function () {
            let c = this.form2New;
            this.$dialog.open(
                c.comp,
                {
                    data: {formData: { 
                        formType: c.formType
                    }}, 
                    onClose: this.updateData, 
                    props: {
                        header: c.formName,
                        style: {
                            width: '75vw',
                        },
                        modal: true,
                    }, 
                },
            );
        },
        init: function () {
            let firebaseConfig = {
                // // ...
                // // The value of `databaseURL` depends on the location of the database
                // databaseURL: "https://vue-app-test-14344-default-rtdb.asia-southeast1.firebasedatabase.app/",
                apiKey: "AIzaSyBtxn1Mu6lFTmXi61o5_91gBSvNT26RBho",
                authDomain: "vue-app-test-14344.firebaseapp.com",
                databaseURL: "https://vue-app-test-14344-default-rtdb.asia-southeast1.firebasedatabase.app",
                projectId: "vue-app-test-14344",
                storageBucket: "vue-app-test-14344.appspot.com",
                messagingSenderId: "686022331262",
                appId: "1:686022331262:web:d6d6311a79702fb095c12f"
            };
            this.firebase.app = initializeApp(firebaseConfig);
        },
        editData: function (_data) {
            console.log(_data);
            switch (_data.formType) {
                case 'formHr':
                    this.$dialog.open(
                        FormHr,
                        {
                            data: {
                                formData: _data
                            }, 
                            onClose: this.updateData,
                            props: {
                                header: `人事制度`, 
                                style: {
                                    width: '75vw',
                                },
                                modal: true,
                            }, 
                        },
                    );
                    break;
                case 'formIntegrity':
                    this.$dialog.open(FormIntegrity, {
                        data: {
                            formData: _data
                        }
                    });
                    break;
            }
        },
        updateData: function (opt) {
            let formData = opt.data;
            console.log('udpateData', formData);
            //return;
            let db = getDatabase(this.firebase.app);

            //let formData = this.inputFormData;

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
            ).finally(
                () => {
                    console.log('update finally')
                    this.loadData();
                }
            );

        },
        deleteData: function (data) {
            //alert('a');
            if (!confirm('確定要刪除資料？')) {
                return false;
            }
            console.log(data);
            //return;
            let db = getDatabase(this.firebase.app);
            data.updateDatetimeUtc = dayjs().format('YYYY-MM-DD HH:mm:ss');
            data.ifEnable = false;
            let p = set(ref(db, `formHr/${data.key}`), data);
            p.then(
                (_para) => {
                    console.log('delete(udpate) successfully', _para);
                }
            ).catch(
                (err) => {
                    console.log('errors on delete(udpate) ', err);
                }
            ).finally(
                () => {
                    console.log('finally')
                    this.loadData();
                }
            );
        },
        loadData: function () {
            this.docList.length = 0;
            let db = getDatabase(this.firebase.app);
            let databaseRef = ref(db, '/formHr');
            //let q = query(databaseRef, )
            databaseRef = query(databaseRef, orderByChild('ifEnable'), equalTo(true));

            onValue(databaseRef, (snapshot) => {
                snapshot.forEach((childSnapshot) => {
                    const childKey = childSnapshot.key;
                    const childData = childSnapshot.val();
                    // ...
                    console.log(childKey, childData);

                    // let obj = {};
                    // obj[childKey] = childData;
                    childData.key = childKey;
                    this.docList.push(childData);
                });
                // console.log(snapshot);
            }, {
                onlyOnce: true
            });
        },
    },
    template: `
        <div class="container">
            <h1 class="mt-5"></h1>
            <p class="lead">notes</p>

            <div class="row">
                <select v-model="form2New" class="form-select">
                    <option v-for="(obj, idx) in formListData" :value="obj">{{obj.formName}}</option>
                </select>
                <a @click="newForm">新增</a>
            </div>

            <div class="row">
                <div class="col-md-12">
                    <DataTable :value="docList" tableStyle="min-width: 50rem">
                        <!--<Column field="key" header="PKey"></Column>-->
                        <Column field="year" header="年度"></Column>
                        <Column field="formName" header="表單類別"></Column>
                        <Column field="verifiedAtByBoardOfDirectors" header="董事會通過日期"></Column>
                        <Column header="法令依據">
                            <template #body="slotProps">
                                {{slotProps.data.actDescription}}
                            </template>
                        </Column>
                        <Column field="formName" header="性質"></Column>
                        <Column header="附件">
                            <template #body="slotProps">
                                <ul>
                                    <li v-for="(obj, idx) in slotProps.data.attachmentList">
                                        <a :href="obj.url" target="_blank">{{obj.fileAlias}}</a>
                                    </li>
                                </ul>
                            </template>
                        </Column>

                        <Column header="編輯">
                            <template #body="slotProps">
                                <a @click="editData(slotProps.data)" class="mx-2"><i class="fa-solid fa-pen"></i> </a>
                                <a @click="deleteData(slotProps.data)" class="mx-2"> <i class="fa-solid fa-trash text-danger"></i> </a>
                            </template>
                        </Column>
                        <Column field="updateDatetimeUtc" header="最後更新時間"></Column>
                        
                    </DataTable>        
                </div>
            </div>  

            
            <DynamicDialog />

            <!--
            <div class="row">
                
            </div>

            <div class="row">
                <FormIntegrity></FormIntegrity>
            </div>
            -->
        </div>

    `
};

