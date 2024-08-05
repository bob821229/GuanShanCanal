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
        // rightList: [
          
        // ], 
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
          <form class="d-flex" role="search">
            <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
            <button class="btn btn-outline-success" type="submit">Search</button>
          </form>
        </div>
      </div>
    </nav>
  </header>
  `
};