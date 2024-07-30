import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import {
    getDatabase, ref, onValue, set, push
    , query
    , equalTo
    , orderByChild
} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-database.js";

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

            firebase: {
                app: null,
                db: null,
            },
        }
    },
    methods: {
        openForm: function (f) {
            this.$dialog.open(
                FormHr,
                {
                    data: {formData: { formType: 'formHr'}}, 
                    onClose: this.updateData
                },
            );
        },
        init: function () {
            let firebaseConfig = {
                // ...
                // The value of `databaseURL` depends on the location of the database
                databaseURL: "https://vue-app-test-14344-default-rtdb.asia-southeast1.firebasedatabase.app/",
            };
            this.firebase.app = initializeApp(firebaseConfig);
        },
        editData: function (_data) {
            switch (_data.formType) {
                case 'FormHr':
                    this.$dialog.open(
                        FormHr,
                        {
                            data: {
                                formData: _data
                            }, 
                            onClose: (opt) => {
                                //const callbackParams = opt.data; // {selectedId: 12}
                                console.log(opt.data);
                            }
                        },
                    );
                    break;
                case 'FormIntegrity':
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
                <div class="col-md-12">
                    <DataTable :value="docList" tableStyle="min-width: 50rem">
                        <Column field="key" header="PKey"></Column>
                        <Column field="year" header="年度"></Column>
                        <Column field="formName" header="表單類別"></Column>
                        <Column field="formName" header="董事會通過日期"></Column>
                        <Column header="法令依據">
                            <template #body="slotProps">
                                {{slotProps.data.actDescription}}%
                            </template>
                        </Column>
                        <Column field="formName" header="性質"></Column>

                        <Column header="編輯">
                            <template #body="slotProps">
                                <a @click="edit(slotProps.data)" class="mx-2"><i class="fa-solid fa-pen"></i> </a>
                                <a @click="deleteData(slotProps.data)" class="mx-2"> <i class="fa-solid fa-trash text-danger"></i> </a>
                            </template>
                        </Column>
                        <Column field="updateDatetimeUtc" header="最後更新時間"></Column>
                        
                    </DataTable>        
                </div>
            </div>  

            <div @click="openForm('FormHr')">HR</div>
            <div @click="openForm('FormIntegrity')">Integrity</div>
            
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

