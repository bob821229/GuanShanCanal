export default {
  data() {
    return {
      message: 'Hello Vue!', 
    }
  },
  computed: {
    // configData() {
    //   return this.config;
    // }
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
    
  }, 
  template: `
    <form>
      <h3>誠信經營規範</h3>
      <div class="mb-3">
        <label for="exampleInputPassword1" class="form-label">法令依據</label>
        <input type="password" class="form-control" id="exampleInputPassword1">
      </div>
      <div class="mb-3">
        <label for="exampleInputPassword1" class="form-label">年度</label>
        <input type="password" class="form-control" id="exampleInputPassword1">
      </div>
      <div class="mb-3">
        <label for="exampleInputPassword1" class="form-label">董事會通過日期</label>
        <input type="password" class="form-control" id="exampleInputPassword1">
      </div>
      <div class="mb-3">
        <label for="exampleInputPassword1" class="form-label">主管機關備查字號</label>
        <input type="password" class="form-control" id="exampleInputPassword1">
      </div>
      <div class="mb-3">
        <label for="exampleInputPassword1" class="form-label">主管機關備查日期</label>
        <input type="password" class="form-control" id="exampleInputPassword1">
      </div>
      <div class="mb-3">
        <label for="exampleInputPassword1" class="form-label">附件</label>
        <input type="password" class="form-control" id="exampleInputPassword1">
      </div>
      <button type="submit" class="btn btn-primary">完成</button>
    </form>
  `
};