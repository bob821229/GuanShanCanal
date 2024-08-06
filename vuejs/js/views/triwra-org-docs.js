// import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
const { createApp, ref } = Vue;
//import { definePreset } from '@primevue/themes';
import Header from '../components/header.js'
import Footer from '../components/footer.js'
// import ComSupportOrgDocList from './triwra-org-docs/ComSupportOrgDocList.js'
// import GovSupportOrgDocList from './triwra-org-docs/GovSupportOrgDocList.js'
// import IADocList from './triwra-org-docs/IADocList.js'
// import TriwraDocList from './triwra-org-docs/TriwraDocList.js'
import DocList from './triwra-org-docs/DocList.js'
import Blank from './blank.js';

// import FormHr from '../components/triwra-org-docs/form-hr.js'
// import FormIntegrity from '../components/triwra-org-docs/form-integrity.js'


var app = createApp({
    components: {
        Header,
        Footer,
        // ComSupportOrgDocList,
        // GovSupportOrgDocList,
        // IADocList,
        // TriwraDocList,
        DocList,
        Blank,
        
    },
    provide() {
        // use function syntax so that we can access `this`
        return {
            currentComponent: this.currentComponentData, //this.currentComponent
        }
    },
    computed: {
        currentComponentData() {
            return this.currentComponent;
        }, 
        headerConfigData(){
            this.headerConfig.leftMenuList.forEach(obj => {
                obj.ifActive = ((obj.component == this.designatedPath) || (obj.component == this.currentComponentData));
            });
            return this.headerConfig;
        }, 
        
    },
    data() {
        return {
            currentComponent: `Blank`,
            designatedPath: ``, 
            headerConfig: {
                CI: {
                    //logoUri: null, 
                    siteName: `農田水利財團法人專區`
                },
                leftMenuList: [
                    // { caption: '政府捐助之財團法人', url: null, component: 'GovSupportOrgDocList' },
                    // { caption: '民間捐助之財團法人', url: null, component: 'ComSupportOrgDocList' },
                    // { caption: '主管機關', url: null, component: 'IADocList' },
                    // { caption: '執行單位', url: null, component: 'TriwraDocList' },
                    { caption: '文件上傳', url: null, component: 'DocList' },
                ]
            },
        }
    },
    mounted() {
        let urlParams = new URLSearchParams(window.location.search);

        if(urlParams.has('comp')){
            let comp = urlParams.get('comp');
            let q = this.headerConfig.leftMenuList.findIndex( _o => _o.component == comp);

            if(q >= 0){
                this.currentComponent = comp;
            }
        }
        
    }, 
    methods: {

    }, 
    template: `

    <Header :config="headerConfigData" @switch-view="(comp) => { this.currentComponent = comp; this.designatedPath = null;}"></Header>


    <main class="flex-shrink-0">
        <div class="container">
            <component :is="currentComponent"></component>
        </div>
    </main>

    
    
    <Footer></Footer>   
    `
});

app.use(
    PrimeVue.Config
    ,
    {
        theme: {
            //preset: PrimeVue.Themes.Lara
            //preset: PrimeVue.Themes.Nora
            preset: PrimeVue.Themes.Aura,
            //preset: MyPreset,
            options: {
                //prefix: 'p',
                darkModeSelector: '.my-app-dark',   //套用時會切換成 dark mode
                //cssLayer: false
            }
        }, 
        locale: {
            firstDayOfWeek: 1,
            dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
            dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
            dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
            monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            monthNamesShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            today: '今天',
            clear: '清除'
        }
    }
    //{ unstyled: true }
);
app.use(
    PrimeVue.DialogService
),
// app.component('Accordion', PrimeVue.Accordion);
// app.component('AccordionPanel', PrimeVue.AccordionPanel);
// app.component('AccordionHeader', PrimeVue.AccordionHeader);
// app.component('AccordionContent', PrimeVue.AccordionContent);
app.component('Card', PrimeVue.Card);

app.component('DataTable', PrimeVue.DataTable);
app.component('Column', PrimeVue.Column);
app.component('ColumnGroup', PrimeVue.ColumnGroup);   // optional
app.component('Row', PrimeVue.Row);                   // optional

app.component('DatePicker', PrimeVue.DatePicker);
app.component('FileUpload', PrimeVue.FileUpload);

/** Dialog */
app.component('Dialog', PrimeVue.Dialog);                   // optional
app.component('DynamicDialog', PrimeVue.DynamicDialog);
//app.component('DialogService', PrimeVue.DialogService);
//app.component('useDialog', PrimeVue.UseDialog);

// app.component('FormHr', FormHr);
// app.component('FormIntegrity', FormIntegrity);


app.mount('app')
