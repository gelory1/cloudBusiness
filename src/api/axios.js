import Vue from 'vue';
import axios from 'axios';
Vue.prototype.$http = axios;
// 微服务接口
// let wfwUrl = 'http:// dbengine:9080/api/dbengine/sql';
// // 新联机房-内网接口
// let xljknwUrl = 'http://192.168.11.215:31380/public/api/xlassets/query';
// // 阿里云机房-内网接口
// let alynwUrl = 'http://172.16.11.203:31380/public/api/xlassets/query';
// // 外网接口
// let wwUrl = 'http://www.chinadny.com:9080/interface/transpond/xlassets/query';
// // 单元测试接口地址
// let dycsUrl = 'http://10.0.17.213:31380/public/api/xlassets/query';

// axios.defaults.baseURL = 'http://10.0.17.213:31380';
// axios.defaults.baseURL = 'http://xlassets:9080/api/xlassets/query';
// axios.defaults.baseURL = 'http://192.168.1.101:9080';
// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.headers.post['user'] = 'x';
axios.defaults.headers.post['key'] = 'x';

// 请求拦截器
axios.interceptors.request.use(    
    config => {
        // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
        // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
        // const token = store.state.token;        
        // token && (config.headers.Authorization = token);
        return config;    
    },    
    error => {        
        return Promise.error(error);    
    })

// 响应拦截器
axios.interceptors.response.use(    
    response => {        
        if (response.status === 200 && response.data.code === 0 && response.data.result && response.data.result !==""||response.data.password) {            
            return Promise.resolve(response);        
        } else {            
            console.warn(response.data.message);
            return Promise.reject(response);        
        }    
    },
    // 服务器状态码不是200的情况    
    // error => {        
    //     if (error.response.status) {            
    //         switch (error.response.status) {                
    //             // 401: 未登录                
    //             // 未登录则跳转登录页面，并携带当前页面的路径                
    //             // 在登录成功后返回当前页面，这一步需要在登录页操作。                
    //             case 401:                    
    //                 router.replace({                        
    //                     path: '/login',                        
    //                     query: { redirect: router.currentRoute.fullPath } 
    //                 });
    //                 break;
    //             // 403 token过期                
    //             // 登录过期对用户进行提示                
    //             // 清除本地token和清空vuex中token对象                
    //             // 跳转登录页面                
    //             case 403:                     
    //                 Toast({                        
    //                     message: '登录过期，请重新登录',                        
    //                     duration: 1000,                        
    //                     forbidClick: true                    
    //                 });                    
    //                 // 清除token                    
    //                 localStorage.removeItem('token');                    
    //                 store.commit('loginSuccess', null);                    
    //                 // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
    //                 setTimeout(() => {                        
    //                     router.replace({                            
    //                         path: '/login',                            
    //                         query: { 
    //                             redirect: router.currentRoute.fullPath 
    //                         }                        
    //                     });                    
    //                 }, 1000);                    
    //                 break; 
    //             // 404请求不存在                
    //             case 404:                    
    //                 Toast({                        
    //                     message: '网络请求不存在',                        
    //                     duration: 1500,                        
    //                     forbidClick: true                    
    //                 });                    
    //             break;                
    //             // 其他错误，直接抛出错误提示                
    //             default:                    
    //                 Toast({                        
    //                     message: error.response.data.message,                        
    //                     duration: 1500,                        
    //                     forbidClick: true                    
    //                 });            
    //         }            
    //         return Promise.reject(error.response);        
    //     }       
    // }
);

const workflow = {
    // 登陆
    GetLOGIN (params) {
        return axios.post('/public/api/xlselect/login',params);
    },
    // 设备资产查询
    PostXLASSETS (params) {
        return axios.post('/public/api/xlassets/query',params);
    },
    // 订单查询
    XLORDER (params) {
        return axios.post('/public/api/xlorder/query',params);
    },
    // 客户查询
    XLCUSTOMER (params) {
        return axios.post('/public/api/xlcustomer/query',params);
    },
    // 客户新增
    SETCUSTOMER (params) {
        return axios.post('/public/api/xlcustomer/set',params);
    },
    // 客户编辑
    UPDATECUSTOMER (params) {
        return axios.post('/public/api/xlcustomer/update',params);
    },
    // 客户删除
    DELETECUSTOMER (params) {
        return axios.post('/public/api/xlcustomer/delete',params);
    },
    // 合同查询
    XLCONTRACT (params) {
        return axios.post('/public/api/xlcontract/query',params);
    },
    // 合同编辑
    UPDATECONTRACT (params) {
        return axios.post('/public/api/xlcontract/update',params);
    },
    // 城市查询 客户查询
    XLSELECT (params) {
        return axios.post('/public/api/xlselect/query',params);
    }
    

};
export default workflow;
