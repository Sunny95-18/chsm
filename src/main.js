import 'babel-polyfill'
import '@/utils/global'
import 'view-design'
import App from './App'
import router from './router'
import store from './store/index';


// 样式
import 'view-design/dist/styles/iview.css';
//引入全局
import md5 from 'js-md5'
import Vue from 'vue'
Vue.prototype.$md5=md5;



// 模拟数据 - 正式环境需要关闭
// import '@/mock/'

// 新版本ViewUI不用调用Vue.use
//Vue.use(ViewUI);
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  created () {
    // console.log("初始化菜单。。。");
    this.$store.commit('updateMenulist');
  }
})
