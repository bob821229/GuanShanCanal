// import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
const { createApp, ref } = Vue;
//import { definePreset } from '@primevue/themes';
import Header from '../components/header.js'
import Footer from '../components/footer.js'
import DummyContent from './dummyContent.js'
import Product from './btw/product.js'

var app = createApp({
    components: {
        Header,
        Footer,
        DummyContent,
        Product,
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

    <Header></Header>


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
