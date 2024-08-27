// import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
const { createApp, ref } = Vue;
//import { definePreset } from '@primevue/themes';
import Header from '../components/header.js'
import Footer from '../components/footer.js'
import DummyContent from '../views/dummyContent.js'
import Map from '../views/map.js'

var app = createApp({
    components: {
        Header,
        Footer,
        DummyContent,
        Map, 
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
        }
    },
    data() {
        return {
            currentComponent: `DummyContent`,
            description: ``,
        }
    },
    template: `
    <main class="flex-shrink-0">
        <component :is="currentComponent"></component>
    </main>

    
    
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
app.component('Timeline', PrimeVue.Timeline);
app.component('Select', PrimeVue.Select);


app.component('DataTable', PrimeVue.DataTable);
app.component('Column', PrimeVue.Column);
app.component('ColumnGroup', PrimeVue.ColumnGroup);   // optional
app.component('Row', PrimeVue.Row);                   // optional

app.mount('app')
