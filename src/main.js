import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import 'handsontable/dist/handsontable.full.css';
import "./assets/css/nucleo-icons.css";
import "./assets/css/nucleo-svg.css";
import MaterialDashboard from "./material-dashboard";
import vueCookie from "vue3-cookies";

const appInstance = createApp(App);
appInstance.use(router);
appInstance.use(store);
appInstance.use(MaterialDashboard);
appInstance.use(vueCookie);
appInstance.mount("#app");
