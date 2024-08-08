const { createApp, ref } = Vue;

import { firebaseDataAccess } from "../firebaseDataAccess.js"

var app = createApp({
    components: {
        // Header,
        // Footer,
    },
    data() {
        return {
            dataAccess: null,
            credential: {
                account: null,
                pwd: null
            }, 
            failedMsg: null
        }
    },
    methods: {
        init: function () {
            this.dataAccess = firebaseDataAccess();
        },
        login(e) {
            e.preventDefault();
            console.log(this.credential);
            this.dataAccess.getData(
                {
                    path: '/projectOrganizationDocUser', 
                    key: 'account_pwd',
                    value: `${this.credential.account}_${this.credential.pwd}`
                }, 
                (result) => {
                    console.log(result);
                    if(result.length > 0){
                        let _r = result[0];
                        let profile = {
                            name: _r.userName, 
                            role: _r.role, 
                            organizationId: _r.organizationId,
                            organization: _r.userName,
                        };
                        let sProfile = JSON.stringify(profile);
                        location.href = `triwra-org-docs.html?comp=docList&r=${sProfile}`;
                        this.failedMsg = null;
                    }else{
                        this.failedMsg = "帳號或密碼錯誤！";
                    }
                }
            );
        },
    },
    mounted() {
        this.init();
    },
    template: `
        <main class="form-signin w-100 m-auto">
        <form action="index.html">
            <!--<img class="mb-4" src="/docs/5.3/assets/brand/bootstrap-logo.svg" alt="" width="72" height="57">-->
            <h1 class="h3 mb-3 fw-normal">農田水利財團法人專區</h1>
            <h3 class="h3 mb-3 fw-normal">請登入</h3>
            <div class="form-floating">
            <input type="text" class="form-control" id="floatingInput" placeholder="登入帳號" v-model="credential.account">
            <label for="floatingInput">登入帳號</label>
            </div>
            <div class="form-floating">
            <input type="password" class="form-control" id="floatingPassword" placeholder="登入密碼" v-model="credential.pwd">
            <label for="floatingPassword">登入密碼</label>
            </div>

            <div class="form-check text-start my-3">
                <input class="form-check-input" type="checkbox" value="remember-me" id="flexCheckDefault">
                <label class="form-check-label" for="flexCheckDefault">
                    Remember me
                </label>
            </div>

            <div class="form-check text-start my-3 text-danger text-center" v-if="failedMsg != null">
                {{failedMsg}}
            </div>

            <button class="btn btn-primary w-100 py-2" type="submit" @click="login">登入</button>
            <p class="mt-5 mb-3 text-body-secondary" v-if="false">&copy; 2017–2024</p>
        </form>
        </main>
    
    `
});

app.mount('app')
