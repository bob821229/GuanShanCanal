// import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js'
// import {
//     getDatabase, ref, onValue, set, push
//     , query
//     , equalTo
//     , orderByChild
// } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";

import FormForApprove from '../../components/triwra-org-docs/form-for-approved.js'
import FormForReference from '../../components/triwra-org-docs/form-for-reference.js'
import FormAuthorized from '../../components/triwra-org-docs/form-authorized.js'
import FormLicense from '../../components/triwra-org-docs/form-license.js'
import FormPerformanceReport from '../../components/triwra-org-docs/form-performance-report.js'
import FormCyberSecurity from '../../components/triwra-org-docs/form-cyber-security.js'
import FormDirectorNSupervisorList from '../../components/triwra-org-docs/form-director-n-supervisor-list.js'
import FormSingleFile from '../../components/triwra-org-docs/form-single-files.js'
import FormMultipleFiles from '../../components/triwra-org-docs/form-multiple-files.js'
import FormOther from '../../components/triwra-org-docs/form-other.js'

import {firebaseDataAccess} from "../../firebaseDataAccess.js"
import {fileUploader} from "../../fileUploader.js"

const { computed } = Vue;
const { FilterMatchMode } = PrimeVue;//from '@primevue/core/api';

export default {
    components: {
        FormForApprove,
        FormForReference,
        FormAuthorized, 
        FormLicense, 
        FormPerformanceReport, 
        FormCyberSecurity, 
        FormDirectorNSupervisorList,
        FormSingleFile,
        FormMultipleFiles,
        FormOther,
    },
    inject: ['user'],
    provide(){
        return {
            organizationList: this.organizationList, 
            //user: computed(() => this.user),
            fileUploader:  computed(() => this.fileUploader),
        }
    }, 
    mounted() {
        this.init();
    },
    watch: {
        user: function(n, o){
            this.initDataAccess();
        }
    }, 
    data() {
        return {
            //user: null,
            // {
            //     name: null, 
            //     role: 22, 
            //     organizationId: -1,
            // }, 
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
                // { organizationId: 10, name: '全部政府捐助之財團法人'},
                // { organizationId: 11, name: '全部財團法人'},
                // { organizationId: 12, name: '主管機關'},
                // { organizationId: 13, name: '執行單位'},
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
                    {formName: '法院發給之法人登記證書(影本)', formType: 'formCompanyRegistration', actDescription: '(財團法人法第12條第2項)', componentName: 'FormForReference'},
                    {formName: '會計制度', formType: 'formAccounting', actDescription: '(財團法人法第24條第1項、農業財團法人會計處理及財務報告編製準則第5條第2項)', componentName: 'FormForReference'},
                    {formName: '內部控制及稽核制度', formType: 'formAudit', actDescription: '(財團法人法第24條第2項)', componentName: 'FormForReference'},
                    {formName: '決算書及監察報告書', formType: 'formFinancialStatement', actDescription: '(財團法人法第25條第2項、第24條第4項、農業財團法人會計處理及財務報告編製準則第19條第1項第2款第2目)', componentName: 'FormForReference'},
                    {formName: '收支營運預計表與營運及資金運用計畫', formType: 'formOperationPlan', actDescription: '(財團法人法第24條第4項、農業財團法人會計處理及財務報告編製準則第19條第1項第2款第1目)', componentName: 'FormForReference'},
                    //{formName: '', formType: 'form', actDescription: '', componentName: ''}, 
                ], 
                "11": [
                    {formName: '董監事名單', formType: 'form', actDescription: '', componentName: 'FormDirectorNSupervisorList'}, 
                    {formName: '法人明細表', formType: 'form', actDescription: '', componentName: 'FormSingleFile'}, 
                    {formName: '政府代表補充資料表', formType: 'form', actDescription: '', componentName: 'FormSingleFile'}, 
                    {formName: '效益評估表及轉投資情形表', formType: 'form', actDescription: '', componentName: 'FormSingleFile'}, 
                    {formName: '退休軍公教人員再任表', formType: 'form', actDescription: '', componentName: 'FormSingleFile'}, 
                    {formName: '預算綜計表', formType: 'form', actDescription: '', componentName: 'FormSingleFile'}, 
                    {formName: '法人相關資料表', formType: 'form', actDescription: '', componentName: 'FormMultipleFiles'}, 
                    {formName: '法人概況表及檢討情形表', formType: 'form', actDescription: '', componentName: 'FormMultipleFiles'}, 
                    {formName: '董監事績效考核表', formType: 'form', actDescription: '', componentName: 'FormMultipleFiles'}, 
                    {formName: '主管機關修正之行政監督報告', formType: 'form', actDescription: '', componentName: 'FormMultipleFiles'}, 
                    {formName: '實地查核報告', formType: 'form', actDescription: '', componentName: 'FormMultipleFiles'}, 
                    {formName: '其他', formType: 'form', actDescription: '', componentName: 'FormOther'}, 
                    //{formName: '', formType: 'form', actDescription: '', componentName: ''}, 
                ], 
                "10": [
                    //{formName: '', formType: 'form', actDescription: '', componentName: ''}, 
                    {formName: '協助主管機關修訂資料初稿', formType: 'form', actDescription: '', componentName: 'FormOther'},
                    {formName: '其他資料', formType: 'form', actDescription: '', componentName: 'FormOther'},
                ], 
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
            // firebase: {
            //     app: null,
            //     db: null,
            // },
            form2New: ``,
            dataAccess: null, 
            fileUploader: null, 
            filters: {
                global: { value: null, matchMode: FilterMatchMode.CONTAINS },
                // name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
                // 'country.name': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
                // representative: { value: null, matchMode: FilterMatchMode.IN },
                // status: { value: null, matchMode: FilterMatchMode.EQUALS },
                // verified: { value: null, matchMode: FilterMatchMode.EQUALS }
            }, 
            customFilter: {
                yearBegin: 0,
                yearEnd: 113,
                organizationId: null, 
                formComponent: null
            }

        }
    },
    computed: {
        formListData(){

            // //台農院和農水署不新增其他角色的表單文件
            // //大權限的使用者不疊加小權限的表單
            //let baseList = [];
            // if(this.user.role <= 11){
            //     baseList = [...this.formListRole['22'], ...this.formListRole['21']];
            // }
            // if(this.user.role <= 10){
            //     baseList = [...baseList, ...this.formListRole['11']];
            // }

            // this.formList = [...baseList, ...this.formListRole[`${this.user.role}`]];
            // console.log('formListData', this.formList);
            this.formList = this.formListRole[`${this.user.role}`];
            this.formList.forEach(obj => {
                obj.comp = eval(obj.componentName)
            });
            return this.formList;
        }, 
        userData(){
            // switch(this.user.role){
            //     case 10: 
            //         this.user.organization = '台農院';
            //         break;
            //         case 11: 
            //             this.user.organization = '農水署';
            //             break;
            //             default: 
            //                 if(this.user.organizationId != -1){
            //                     this.user.organization = (this.organizationList.filter(f=> f.organizationId == this.user.organizationId))[0].name;
            //                 }
            //                 break;
            // }
            return this.user;
        }, 
        docListData(){
            console.log('docListData');
            this.docList.forEach(i => {
                let found = this.organizationList.filter(org => org.organizationId == i.organizationId);
                i.organization = found.length > 0 ? found[0].name : null;

                let found2 = this.formGroupComponentList.filter(comp => comp.componentName == i.formComponent);
                i.fromGroupName = found2.length > 0 ? found2[0].formGroupName : null;
            });

            let l = this.docList;
            l = this.filterData(l, 'year', Number(this.customFilter.yearBegin), '>=');
            l = this.filterData(l, 'year', Number(this.customFilter.yearEnd), '<=');
            l = this.filterData(l, 'organizationId', this.customFilter.organizationId);
            l = this.filterData(l, 'formComponent', this.customFilter.formComponent);

            return l;
        }, 
    }, 
    methods: {
        filterData: function(list, fieldName, value, operation){
            if(value == null || value.toString().length == 0){
                return list;
            }
            
            console.log('filterData', fieldName, value);
            if(operation == '>='){
                return list.filter(item => item[fieldName] >= value);
            } else if (operation == '<='){
                return list.filter(item => item[fieldName] <= value);
            } else {
                return list.filter(item => item[fieldName] == value);
            }
        },
        newForm: function () {
            let c = this.form2New;
            if(c == ``){
                alert('請選擇要新增的文件類別');
                return;
            }
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
            this.user = this.userRoleList[0];
            this.initDataAccess();
            this.initFileUploader();

        },
        initDataAccess: function(){
            this.dataAccess = firebaseDataAccess(this.user);
            this.dataAccess.loadData((_list) => {
                this.docList = _list;
            });
            console.log('main app', this.docList);
        },
        initFileUploader: function(){
            this.fileUploader = fileUploader();
        }, 
        editData: function (_data) {
            console.log(_data);
            console.log(_data.formComponent);
            let comp = eval(_data.formComponent);
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
            let p = this.dataAccess.updateData(formData);
            p.finally(
                () => {
                    console.log('update finally')
                    this.dataAccess.loadData((_list) => {
                        this.docList = _list;
                    });
                }
            );
        },
        deleteData: function (data) {
            //alert('a');
            if (!confirm('確定要刪除資料？')) {
                return false;
            }
            console.log(data);
            let p = this.dataAccess.deleteData(data);
            p.finally(
                () => {
                    console.log('finally')
                    this.dataAccess.loadData((_list) => {
                        this.docList = _list;
                    });
                }
            );
        },
    },
    template: `
        <div class="container">
            <h5 class="mt-3">文件上傳</h5>
            <p class="lead">說明文</p>
           

            <div class="row mb-2" v-if="user != null">
                <div class="input-group">
                    <select v-model="form2New" class="form-select">
                        <option v-for="(obj, idx) in formListData" :value="obj">{{obj.formName}}</option>
                    </select>
                    <a class="btn btn-outline-secondary" @click="newForm">新增文件</a>
                </div>

            </div>

            <div class="row">
                <div class="col-md-12">
                    <DataTable :value="docListData" tableStyle="min-width: 50rem"
                        
                        sortField="updateDatetimeUtc"
                        :sortOrder="-1"

                        paginator 
                        :rows="10" 
                        :rowsPerPageOptions="[10, 20, 50]"
                    
                        :loading="loading"
                        v-model:filters="filters"
                        :globalFilterFields="['formName', 'organization', 'verifiedAtByBoardOfDirectors', 'organization', 'fromGroupName', 'actDescription']">

                        <template #header>
                            <div class="row">
                                <div v-if="user != null && user.role < 20" class="col-md-3">
                                    <div class="input-group">
                                        <span class="input-group-text" id="basic-addon1">法人</span>
                                        <select class="form-select" v-model="customFilter.organizationId">
                                            <option></option>
                                            <option v-for="(obj) in organizationList" :value="obj.organizationId">{{obj.name}}</option>
                                        </select>
                                    </div>
                                </div>
                                <div :class="{'col-md-3': user != null && user.role < 20, 'col-md-4': user != null && user.role >= 20}">
                                    <div class="input-group">
                                        <span class="input-group-text" id="basic-addon1">年度</span>
                                        <input type="number" class="form-control" v-model="customFilter.yearBegin">
                                        <span class="input-group-text" id="basic-addon1">~</span>
                                        <input type="number" class="form-control" v-model="customFilter.yearEnd">
                                    </div>
                                </div>
                                <div :class="{'col-md-3': user != null && user.role < 20, 'col-md-4': user != null && user.role >= 20}">
                                    <div class="input-group">
                                        <span class="input-group-text" id="basic-addon1">類別</span>
                                        <select class="form-select" v-model="customFilter.formComponent">
                                            <option></option>
                                            <option v-for="(obj) in formGroupComponentList" :value="obj.componentName">{{obj.formGroupName}}</option>
                                        </select>
                                    </div>
                                </div>
                                <div :class="{'col-md-3': user != null && user.role < 20, 'col-md-4': user != null && user.role >= 20}">
                                    <input type="text" v-model="filters['global'].value" class="form-control" placeholder="關鍵字查詢">
                                </div>
                            </div>
                        </template>
                        <template #empty> 查無資料 </template>
                        <template #loading> 載入資料中… </template>

                        <Column header="" 
                            headerStyle="width: 100px; text-align: center" bodyStyle="text-align: center; overflow: visible">
                            <template #body="slotProps">
                                <a @click="editData(slotProps.data)" class="mx-2" href="#"><i class="fa-solid" :class="[((user.role == 11 && user.userId == slotProps.data.createUserId) || (user.role != 11)) ? 'fa-pen' : 'fa-eye']"></i> </a>
                                <a @click="deleteData(slotProps.data)" class="mx-2" href="#" v-if="((user.role == 11 && user.userId == slotProps.data.createUserId) || (user.role != 11))"> <i class="fa-solid fa-trash text-danger"></i> </a>
                                <!--
                                ur: {{user.role}}<br>
                                uo: {{user.organizationId}}<br>
                                do: {{slotProps.data.organizationId}}
                                -->
                            </template>
                        </Column>
                        <Column sortable field="year" header="年度"></Column>
                        <Column sortable field="formName" header="表單類別"></Column>
                        <Column sortable field="organization" header="農田水利財團法人" v-if="user != null && user.role < 20"></Column>
                        <Column sortable field="verifiedAtByBoardOfDirectors" header="董事會通過日期"></Column>
                        <Column sortable header="法令依據" field="actDescription">
                            <template #body="slotProps">
                                {{slotProps.data.actDescription}}
                            </template>
                        </Column>
                        <Column sortable field="fromGroupName" header="性質"></Column>
                        <Column sortable field="ifFormComplete" header="文件經核定/備查/核准/許可">
                            <template #body="slotProps">
                                {{(slotProps.data.ifFormComplete == null) ? 'N/A' : (slotProps.data.ifFormComplete) ? '是' : '否'}}
                            </template>
                        </Column>
                        <Column header="附件">
                            <template #body="slotProps">
                                <ul>
                                    <li v-for="(obj, idx) in slotProps.data.attachmentList">
                                        <a :href="obj.url" target="_blank">{{obj.fileAlias}}</a>
                                    </li>
                                </ul>
                            </template>
                        </Column>

                        <Column sortable field="updateDatetimeUtc" header="最後更新時間">
                            <template #body="slotProps">
                                {{slotProps.data.updateDatetimeUtc}} (by {{slotProps.data.updateUser}})
                            </template>
                        </Column>
                        
                    </DataTable>        
                </div>
            </div>  

            
            <DynamicDialog />
        </div>

    `
};

