import Vue from 'vue'
import Vuetify from 'vuetify'
import axios from 'axios';
import VueToast from 'vue2-toast';
import App from './App.vue'
import router from './router'
import './registerServiceWorker'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'
import 'vue2-toast/lib/toast.css';

Vue.config.productionTip = false
Vue.prototype.$axios = axios;

Vue.use(Vuetify, {
	iconfont: 'mdi'
})
Vue.use(VueToast, {
	type: 'top'
})

router.beforeEach((to, from, next) => {
	if (to.meta.requireAuth) {
		const token = localStorage.getItem('token');
		if (token) {
			next();
		} else {
			next('/login');
		}
	} else {
		next();
	}
})

// axios 请求拦截器处理请求数据
axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    config.headers.common['Authorization'] = 'Bearer ' + token;
    return config;
})

// axios 响应拦截器处理响应数据
axios.interceptors.response.use(res => {
    return res.data;
}, err => {
    return Promise.reject(err);
})

new Vue({
	router,
	render: h => h(App)
}).$mount('#app')