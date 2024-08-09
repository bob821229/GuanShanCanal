// import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
const { createApp, ref } = Vue;
//import { definePreset } from '@primevue/themes';
import Header from '../components/header.js'
import Footer from '../components/footer.js'

const { useVuelidate } = Vuelidate;
const { required, email, helpers } = VuelidateValidators;

var app = createApp({
    components: {
        Header,
        Footer,
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
            thisForm: {
                email: null,
                pwd: null,
                selectedItem: null,
                chk: [],
                rdo: null, 
                items: []
            }
        }
    },
    methods: {
        async submitForm (e) {
            e.preventDefault();
            const isFormCorrect = await this.v$.$validate()
            // you can show some extra alert to the user or just leave the each field to show it's `$errors`.
            if (!isFormCorrect) return
            // actually submit form
          }, 
        // ifAnyItem: function(v){
        //     return v.length > 0;
        // }
        ifAnyCollection: function(v){
            return (v.length > 0);
        }
    }, 

    setup() {
        return { v$: useVuelidate() }
    },
    validations() {
        return {
            thisForm: {
                email: { 
                    required: helpers.withMessage('必填', required), 
                    email: helpers.withMessage('Email格式不正確', email) },
                pwd: { required: helpers.withMessage('必填', required) },
                selectedItem: { required },
                chk: { required },
                rdo: { required }, 
                items: { 
                    ifAnyItem: helpers.withMessage('至少設定一組Item', this.ifAnyCollection)
                },
            }
        }
    },
    template: `

    <Header></Header>


    <main class="flex-shrink-0">
        <div class="container my-4">
            <form>
                <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label">Email address</label>
                    <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" v-model="thisForm.email" @blur="v$.thisForm.email.$touch">
                    <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
                    {{v$.thisForm.email.$error}}
                    <p v-for="error of v$.thisForm.email.$errors"
                        :key="error.$uid">
                        <strong>{{ error.$validator }}</strong>
                        <small> on property</small>
                        <strong>{{ error.$property }}</strong>
                        <small> says:</small>
                        <strong>{{ error.$message }}</strong>
                    </p>
                </div>
                <div class="mb-3">
                    <label for="exampleInputPassword1" class="form-label">Password</label>
                    <input type="password" class="form-control" id="exampleInputPassword1" v-model="thisForm.pwd" @blur="v$.thisForm.pwd.$touch">
                    {{v$.thisForm.pwd.$error}}
                    <p v-for="error of v$.thisForm.pwd.$errors"
                        :key="error.$uid">
                        <strong>{{ error.$validator }}</strong>
                        <small> on property</small>
                        <strong>{{ error.$property }}</strong>
                        <small> says:</small>
                        <strong>{{ error.$message }}</strong>
                    </p>
                </div>
                <select class="form-select" aria-label="Default select example" v-model="thisForm.selectedItem" @blur="v$.thisForm.selectedItem.$touch">
                    <option value="">Open this select menu</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                </select>
                {{v$.thisForm.selectedItem.$error}}
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="chk-1" id="flexCheckDefault" v-model="thisForm.chk">
                    <label class="form-check-label" for="flexCheckDefault">
                        Default checkbox
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="chk-2" id="flexCheckChecked" checked v-model="thisForm.chk">
                    <label class="form-check-label" for="flexCheckChecked">
                        Checked checkbox
                    </label>
                </div>
                {{thisForm.chk}}
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" value="default" v-model="thisForm.rdo">
                    <label class="form-check-label" for="flexRadioDefault1">
                        Default radio
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" value="custom" checked v-model="thisForm.rdo">
                    <label class="form-check-label" for="flexRadioDefault2">
                        custom
                    </label>
                </div>
                {{thisForm.rdo}}

                <div>
                    {{thisForm.items}}
                    <a class="mx-2" @click="thisForm.items.push('a')">+</a>
                    <a class="mx-2" @click="(thisForm.items.length == 0) ? 0 : thisForm.items.splice(0, 1)">-</a>
                    
                    <p v-for="error of v$.thisForm.items.$errors"
                        :key="error.$uid">
                        <strong>{{ error.$validator }}</strong>
                        <small> on property</small>
                        <strong>{{ error.$property }}</strong>
                        <small> says:</small>
                        <strong>{{ error.$message }}</strong>
                    </p>
                </div>

                <p v-for="error of v$.$errors"
                    :key="error.$uid">
                    <strong>{{ error.$validator }}</strong>
                    <small> on property</small>
                    <strong>{{ error.$property }}</strong>
                    <small> says:</small>
                    <strong>{{ error.$message }}</strong>
                </p>

                <button type="submit" class="btn btn-primary" @click="submitForm($event)">Submit</button>
            </form>
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
