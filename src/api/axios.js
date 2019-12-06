import axios from 'axios';
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
        return config;
    },
    error => {
        return Promise.error(error);
    });

// 响应拦截器
axios.interceptors.response.use(
    response => {
        if ((response.status === 200 && response.data.code === 0 && response.data.result && response.data.result !== '') || response.data.password) {
            return Promise.resolve(response);
        } else {
            console.warn(response.data.message);
            return Promise.reject(response);
        }
    });

const workflow = {
    // 登陆
    GetLOGIN (params) {
        return axios.post('/public/api/xlselect/login', params);
    },
    // 设备资产查询
    PostXLASSETS (params) {
        return axios.post('/public/api/xlassets/query', params);
    },
    // 新增发货
    SETXLASSETS (params) {
        return axios.post('/public/api/xlassets/set', params);
    },
    // 删除发货
    DELXLASSETS (params) {
        return axios.post('/public/api/xlassets/delete', params);
    },
    // 编辑发货
    UPDATEXLASSETS (params) {
        return axios.post('/public/api/xlassets/update', params);
    },
    // 订单查询
    XLORDER (params) {
        return axios.post('/public/api/xlorder/query', params);
    },
    // 订单查询
    SETORDER (params) {
        return axios.post('/public/api/xlorder/set', params);
    },
    // 客户查询
    XLCUSTOMER (params) {
        return axios.post('/public/api/xlcustomer/query', params);
    },
    // 客户新增
    SETCUSTOMER (params) {
        return axios.post('/public/api/xlcustomer/set', params);
    },
    // 客户编辑
    UPDATECUSTOMER (params) {
        return axios.post('/public/api/xlcustomer/update', params);
    },
    // 客户删除
    DELETECUSTOMER (params) {
        return axios.post('/public/api/xlcustomer/delete', params);
    },
    // 合同查询
    XLCONTRACT (params) {
        return axios.post('/public/api/xlcontract/query', params);
    },
    // 合同编辑
    UPDATECONTRACT (params) {
        return axios.post('/public/api/xlcontract/update', params);
    },
    // 回款合入
    SETCONTRACT (params) {
        return axios.post('/public/api/xlcontract/set', params);
    },
    // 城市查询 客户查询
    XLSELECT (params) {
        return axios.post('/public/api/xlselect/query', params);
    },
    // 工作台查询
    XLWORKBENCH (params) {
        return axios.post('/public/api/xlworkbench/query', params);
    },
    // 工作台更新
    UPDATEWORKBENCH (params) {
        return axios.post('/public/api/xlworkbench/update', params);
    },
    // 工作台新增
    SETWORKBENCH (params) {
        return axios.post('/public/api/xlworkbench/set', params);
    }

};
export default workflow;
