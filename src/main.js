import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ImageUploader from "vue-image-upload-resize";

Vue.config.productionTip = false;
Vue.use(ImageUploader);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
