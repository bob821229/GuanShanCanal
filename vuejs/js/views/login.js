// import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
const { createApp, ref } = Vue;
//import { definePreset } from '@primevue/themes';
// import Header from '../components/header.js'
// import Footer from '../components/footer.js'

var app = createApp({
    components: {
        // Header,
        // Footer,
    },
    data() {
        return {
            
        }
    },
    template: `
        <main class="form-signin w-100 m-auto">
        <form action="index.html">
            <!--<img class="mb-4" src="/docs/5.3/assets/brand/bootstrap-logo.svg" alt="" width="72" height="57">-->
            <h1 class="h3 mb-3 fw-normal">Please sign in</h1>

            <div class="form-floating">
            <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com">
            <label for="floatingInput">Email address</label>
            </div>
            <div class="form-floating">
            <input type="password" class="form-control" id="floatingPassword" placeholder="Password">
            <label for="floatingPassword">Password</label>
            </div>

            <div class="form-check text-start my-3">
            <input class="form-check-input" type="checkbox" value="remember-me" id="flexCheckDefault">
            <label class="form-check-label" for="flexCheckDefault">
                Remember me
            </label>
            </div>
            <button class="btn btn-primary w-100 py-2" type="submit">Sign in</button>
            <p class="mt-5 mb-3 text-body-secondary">&copy; 2017–2024</p>
        </form>
        </main>
    
    `
});

// app.use(
//     PrimeVue.Config
//     ,
//     {
//         theme: {
//             //preset: PrimeVue.Themes.Lara
//             //preset: PrimeVue.Themes.Nora
//             preset: PrimeVue.Themes.Aura, 
//             //preset: MyPreset,
//             options: {
//                 //prefix: 'p',
//                 darkModeSelector: '.my-app-dark',   //套用時會切換成 dark mode
//                 //cssLayer: false
//             }
//         }
//     }
//     //{ unstyled: true }
// );
// app.component('Card', PrimeVue.Card);
app.mount('app')
