// import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
const { createApp, ref } = Vue;
//import { definePreset } from '@primevue/themes';
import Header from '../components/header.js'
import Footer from '../components/footer.js'
import ComSupportOrgDocList from './triwra-org-docs/ComSupportOrgDocList.js'
import GovSupportOrgDocList from './triwra-org-docs/GovSupportOrgDocList.js'
import IADocList from './triwra-org-docs/IADocList.js'
import TriwraDocList from './triwra-org-docs/TriwraDocList.js'
import Blank from './blank.js';

var app = createApp({
    components: {
        Header,
        Footer,
        ComSupportOrgDocList,
        GovSupportOrgDocList,
        IADocList,
        TriwraDocList,
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
                    { caption: '政府捐助之財團法人', url: null, component: 'GovSupportOrgDocList' },
                    { caption: '民間捐助之財團法人', url: null, component: 'ComSupportOrgDocList' },
                    { caption: '主管機關', url: null, component: 'IADocList' },
                    { caption: '執行單位', url: null, component: 'TriwraDocList' },
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
        }
    }
    //{ unstyled: true }
);
// app.component('Accordion', PrimeVue.Accordion);
// app.component('AccordionPanel', PrimeVue.AccordionPanel);
// app.component('AccordionHeader', PrimeVue.AccordionHeader);
// app.component('AccordionContent', PrimeVue.AccordionContent);
app.component('Card', PrimeVue.Card);


app.component('DataTable', PrimeVue.DataTable);
app.component('Column', PrimeVue.Column);
app.component('ColumnGroup', PrimeVue.ColumnGroup);   // optional
app.component('Row', PrimeVue.Row);                   // optional

app.mount('app')
