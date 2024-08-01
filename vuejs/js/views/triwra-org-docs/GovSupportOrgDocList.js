import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js'
import {
    getDatabase, ref, onValue, set, push
    , query
    , equalTo
    , orderByChild
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";

import FormForApprove from '../../components/triwra-org-docs/form-for-approved.js'
import FormForReference from '../../components/triwra-org-docs/form-for-reference.js'
import FormAuthorized from '../../components/triwra-org-docs/form-authorized.js'
import FormLicense from '../../components/triwra-org-docs/form-license.js'
import FormPerformanceReport from '../../components/triwra-org-docs/form-performance-report.js'
import FormCyberSecurity from '../../components/triwra-org-docs/form-cyber-security.js'
const { computed } = Vue;

export default {
    components: {
        FormForApprove,
        FormForReference,
        FormAuthorized, 
        FormLicense, 
        FormPerformanceReport, 
        FormCyberSecurity, 
    },
    provide(){
        return {
            organizationList: this.organizationList, 
            user: computed(() => this.user),
        }
    }, 
    mounted() {
        this.init();
        this.loadData();
    },
    data() {
        return {
            user: {
                name: null, 
                role: 22, 
                organizationId: -1,
            }, 
            userRoleList: [
                { name: '政府捐助之財團法人', role: 22, organizationId: 2},
                { name: '民間捐助之財團法人', role: 21, organizationId: 9},
                { name: '主管機關', role: 11, organizationId: -1},
                { name: '執行單位', role: 10, organizationId: -1},
            ], 
            organizationList: [
                { organizationId: 1, name: '財團法人農業工程研究中心'},
                { organizationId: 2, name: '財團法人中正農業科技社會公益基金會'},
                { organizationId: 3, name: '財團法人維謙基金會'},
                { organizationId: 4, name: '財團法人七星農業發展基金會'},
                { organizationId: 5, name: '財團法人桃園農田水利研究發展基金會'},
                { organizationId: 6, name: '財團法人臺中環境綠化基金會'},
                { organizationId: 7, name: '財團法人曹公農業水利研究發展基金會'},
                { organizationId: 8, name: '財團法人水利研究發展中心'},
                { organizationId: 9, name: '財團法人農田水利人力發展中心'},
                { organizationId: 10, name: '全部政府捐助之財團法人'},
                { organizationId: 11, name: '全部財團法人'},
                { organizationId: 12, name: '主管機關'},
                { organizationId: 13, name: '執行單位'},
            ], 
            visible: false,
            docList: [

            ],
            formListRole: {
                "22": [
                    {formName: '人事制度', formType: 'formHR', actDescription: '(財團法人法第61條第1項)', componentName: 'FormForApprove'}, 
                    {formName: '會計制度', formType: 'formAccounting', actDescription: '(財團法人法第61條第1項、農業財團法人會計處理及財務報告編製準則第5條第2項)', componentName: 'FormForApprove'}, 
                    {formName: '內部控制及稽核制度', formType: 'formAudit', actDescription: '(財團法人法第61條第1項)', componentName: 'FormForApprove'}, 
                    {formName: '獎金支給基準', formType: 'formBonusPayment', actDescription: '(政府捐助之農業財團法人兼職費薪資及獎金支給原則第5點第1項)', componentName: 'FormForApprove'}, 
    
                    {formName: '法院發給之法人登記證書(影本)', formType: 'formCompanyRegistration', actDescription: '(財團法人法第12條第2項)', componentName: 'FormForReference'}, 
                    {formName: '預算書', formType: 'formBudget', actDescription: '(財團法人法第25條第1項、農業財團法人會計處理及財務報告編製準則第19條第1項第1款第1目)', componentName: 'FormForReference'}, 
                    {formName: '決算書及監察報告書', formType: 'formFinancialStatement', actDescription: '(財團法人法第25條第1項、第2項、農業財團法人會計處理及財務報告編製準則第19條第1項第1款第2目)', componentName: 'FormForReference'}, 
                    {formName: '誠信經營規範', formType: 'formIntegrity', actDescription: '(財團法人法第24條第3項、農業財團法人應適用財團法人法第24條第2項之一定財產總額及誠信經營規範指導原則第10點第1項)', componentName: 'FormForReference'}, 
    
                    //{formName: '', formType: 'form', actDescription: '', componentName: ''}, 
                    {formName: '董事、監察人之兼職費', formType: 'formDirectorNSupervisorWage', actDescription: '(財團法人法第53條第1項、政府捐助之農業財團法人兼職費薪資及獎金支給原則第3點)', componentName: 'FormAuthorized'}, 
                    {formName: '董事長及其他從業人員之薪資支給基準', formType: 'formChairmanPayment', actDescription: '(財團法人法第53條第1項、政府捐助之農業財團法人兼職費薪資及獎金支給原則第4點)', componentName: 'FormAuthorized'}, 
    
                    {formName: '捐助章程', formType: 'formDonationCharter', actDescription: '(財團法人法第45條第2項第1款)', componentName: 'FormLicense'}, 

                    {formName: '行政監督報告與績效目標', formType: 'formPerformanceReport', actDescription: '(財團法人法第56條第1項、財團法人法第61條第2項、政府捐助之農業財團法人行政監督要點第2點第1項)', componentName: 'FormPerformanceReport'}, 
                    
                    {formName: '資通安全維護計畫', formType: 'formSecurityMaintenence', actDescription: '(資通安全管理法第17條第1項)', componentName: 'FormCyberSecurity'}, 
                    {formName: '資通安全事件通報及應變管理程序', formType: 'formSecuritySOP', actDescription: '(資通安全管理法第18條第1項)', componentName: 'FormCyberSecurity'}, 
                    {formName: '資通安全維護計畫實施情形自評表', formType: 'formSecurityPlanCheckList', actDescription: '', componentName: 'FormCyberSecurity'}, 
                    //{formName: '', formType: 'form', actDescription: '', componentName: ''}, 
                ], 
                "21": [
                    //{formName: '', formType: 'form', actDescription: '', componentName: ''}, 

                ]
            }, 
            formGroupComponentList: [
                {componentName: 'FormForApprove', formGroupName: '核定'}, 
                {componentName: 'FormForReference', formGroupName: '備查'}, 
                {componentName: 'FormAuthorized', formGroupName: '核准'}, 
                {componentName: 'FormLicense', formGroupName: '許可'}, 
                {componentName: 'FormPerformanceReport', formGroupName: '行政監督報告與績效目標'}, 
                {componentName: 'FormCyberSecurity', formGroupName: '資通安全資料'}, 

                {componentName: 'FormDirectorNSupervisorList', formGroupName: '董監事名單'}, 
                {componentName: 'FormSingleFile', formGroupName: '1個彙整檔'}, 
                {componentName: 'FormMultipleFiles', formGroupName: '多個彙整檔'}, 
                {componentName: 'FormOther', formGroupName: '其他'}, 
            ], 
            formList: [],
            firebase: {
                app: null,
                db: null,
            },
            form2New: ``,
        }
    },
    computed: {
        formListData(){
            this.formList = this.formListRole[`${this.user.role}`];
            console.log('formListData', this.formList);
            this.formList.forEach(obj => {
                obj.comp = eval(obj.componentName)
            });
            return this.formList;
        }, 
        userData(){
            return this.user;
        }, 
        docListData(){
            this.docList.forEach(i => {
                let found = this.organizationList.filter(org => org.organizationId == i.organizationId);
                i.organization = found.length > 0 ? found[0].name : null;

                let found2 = this.formGroupComponentList.filter(comp => comp.componentName == i.formComponent);
                i.fromGroupName = found2.length > 0 ? found2[0].formGroupName : null;
            });
            return this.docList;
        }, 
    }, 
    methods: {
        newForm: function () {
            let c = this.form2New;
            this.$dialog.open(
                c.comp,
                {
                    data: {formData: { 
                        formType: c.formType, 
                        formName: c.formName, 
                        formComponent: c.componentName, 
                        actDescription: c.actDescription,
                        //organizationId: this.userData.organizationId,
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

            this.user = this.userRoleList[0];
        },
        editData: function (_data) {
            console.log(_data);
            let comp = null;
            switch (_data.componentName) {
                case 'FormForApprove':
                    comp = FormForApprove;    
                    break;
                case 'FormForReferenct':
                    comp = FormForReference;
                    break;
            }
            this.$dialog.open(
                comp,
                {
                    data: {
                        formData: _data
                    }, 
                    onClose: this.updateData,
                    props: {
                        header: _data.formName, 
                        style: {
                            width: '75vw',
                        },
                        modal: true,
                    }, 
                },
            );

        },
        updateData: function (opt) {
            let formData = opt.data;
            if(formData == null){
                return;
            }
            console.log('udpateData', formData);
            //return;
            let db = getDatabase(this.firebase.app);

            //let formData = this.inputFormData;

            let p = null;
            formData.updateDatetimeUtc = dayjs().format('YYYY-MM-DD HH:mm:ss');
            //formData.organizationId = this.user.organizationId;
            if(formData.organizationId == null || formData.organizationId == undefined) formData.organizationId = this.user.organizationId;
            if (formData.key == null) {
                formData.ifEnable = true;
                p = push(ref(db, 'organizationDocList'), formData);
            } else {
                p = set(ref(db, `organizationDocList/${formData.key}`), formData);
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
            let p = set(ref(db, `organizationDocList/${data.key}`), data);
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
            let databaseRef = ref(db, '/organizationDocList');
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
                <select v-model="form2New" class="form-select" v-model="user">
                    <option v-for="(obj, idx) in userRoleList" :value="obj">{{obj.name}}</option>
                </select>
                目前摸擬：{{userData.name}}, {{userData.role}}, {{userData.organizationId}}
            </div>

            <div class="row">
                <select v-model="form2New" class="form-select">
                    <option v-for="(obj, idx) in formListData" :value="obj">{{obj.formName}}</option>
                </select>
                <a @click="newForm">新增</a>
            </div>

            <div class="row">
                <div class="col-md-12">
                    <DataTable :value="docListData" tableStyle="min-width: 50rem">
                        <Column field="year" header="年度"></Column>
                        <Column field="formName" header="表單類別"></Column>
                        <Column field="organization" header="農田水利財團法人" v-if="userData.role < 20"></Column>
                        <Column field="verifiedAtByBoardOfDirectors" header="董事會通過日期"></Column>
                        <Column header="法令依據">
                            <template #body="slotProps">
                                {{slotProps.data.actDescription}}
                            </template>
                        </Column>
                        <Column field="fromGroupName" header="性質"></Column>
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
        </div>

    `
};

