export default {
  data() {
    return {
      message: 'Hello Vue!', 
    }
  },
  computed: {
    configData() {
      return this.config;
    }
  }, 
  methods: {
    switchView: function(componentName){
      if(componentName != null)
        {
          this.$emit('switch-view', componentName);
        }
    }
  },
  props: {
    config: {
      type: Object, 
      default: {
        CI: {
          //logoUri: null, 
          siteName: `Fixed navbar`
        }, 
        leftMenuList: [
          { caption: 'HOME', url: '#', component: null, ifActive: true },
          { caption: 'Login', url: '/vuejs/login.html', component: null },
          { caption: 'Disable', url: null, component: null, ifDisabled: true },
        ], 
        myConsole: {
          profile: {
            name: '財團法人七星農業發展基金會'
          }, 
          menus: [
            { url: 'https://www.kimo.com.tw', text: '變更密碼', target: null}, 
            { url: 'https://www.kimo.com.tw', text: '個人資料', target: '_blank'}, 
          ], 
          ifShowLogout: true,
        }
      }
    }
  }, 
  template: `
  <header>
    <!-- Fixed navbar -->
    <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">{{configData.CI.siteName}}</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarCollapse">
          <ul class="navbar-nav me-auto mb-2 mb-md-0">
            <li class="nav-item" v-for="(obj, idx) in configData.leftMenuList">
              <a class="nav-link" :class="{'active': obj.ifActive, 'disabled': obj.ifDisabled}" :aria-disabled="obj.ifDisabled" aria-current="page" 
                @click="switchView(obj.component)"
                :href="obj.url">{{obj.caption}}</a>
            </li>
          </ul>
          <ul class="navbar-nav ms-auto mb-2 mb-md-0" v-if="config.myConsole != null">
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="avatarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="fa-solid fa-circle-user fa-2x"></i>
              </a>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="avatarDropdown">
                <li><a class="dropdown-item" href="#" class="text-center">{{config.myConsole.profile.name}}</a></li>
                <li><hr class="dropdown-divider"></li>
                <li v-for="(obj, idx) in config.myConsole.menus" class="text-end"><a class="dropdown-item" :href="obj.url" :target="obj.target">{{obj.text}}</a></li>
                
                <li v-if="config.myConsole.ifShowLogout" class="text-end"><a class="dropdown-item" href="triwra-org-login.html">登出</a></li>
              </ul>
            </li>
          </ul>
          <form class="d-flex" role="search" v-if="false">
            <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
            <button class="btn btn-outline-success" type="submit">Search</button>
          </form>
        </div>
      </div>
    </nav>
  </header>
  `
};