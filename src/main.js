import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//import {request, requestMysql} from './network/index'

import { 
  MessageBox,
  Popover,
  Message,
  Button,
  Select,
  Input,
  Form,
FormItem,
Container,
Header,
Breadcrumb,
BreadcrumbItem,
Aside,
Main,Menu,
MenuItem,
MenuItemGroup,
Row,
Col,
Avatar,
Radio,
RadioButton,RadioGroup,
Calendar,Loading,
Dialog,DatePicker,
Table,
TableColumn,
Tag,
Alert} from 'element-ui';

Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$message = Message;
Vue.prototype.$loading = Loading.service;

Vue.use(Loading.directive);
Vue.use(Popover)
Vue.use(Alert)
Vue.use(Tag)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(DatePicker)
Vue.use(Dialog)
Vue.use(Calendar)
Vue.use(RadioButton)
Vue.use(Radio)
Vue.use(RadioButton)
Vue.use(RadioGroup)
Vue.use(Avatar)
Vue.use(Row)
Vue.use(Col)
Vue.use(Button)
Vue.use(Select)
Vue.use(Input)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')




