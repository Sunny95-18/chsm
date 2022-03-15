import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'
import Cookies from 'js-cookie'
import conf from '@/conf/'




const callbackOfThen = (res,callback) => {
    if(callback) {
        if(!res.data || (res.data && res.data.code == conf.responseCodes.success)) {
            callback();
        } else {
            callback(res.data.description || conf.responseErrors.serverError);
        }
    }
} 

const callbackOfCatch = (err,callback) => {
    console.error(err);
    if(callback) {
        callback(err);
    }
}      

{
    let networkStatus = -1;
    // 请求到结果的拦截处理
    axios.interceptors.response.use(config => {
        // 返回请求正确的结果
        return config
    }, error => {
        // 错误的请求结果处理，这里的代码根据后台的状态码来决定错误的输出信息
         console.log("err:",error.response.status)
        if (error && error.response) {
            switch (error.response.status) {
                case 400:
                    error.message = '错误请求'
                    break
                case 401:
                    error.message = '未授权，请重新登录'
                    break
                case 403:
                    error.message = '拒绝访问'
                    break
                case 404:
                    error.message = '请求错误,未找到该资源'
                    break
                case 405:
                    error.message = '请求方法未允许'
                    break
                case 408:
                    error.message = '请求超时'
                    break
                case 500:
                    error.message = '服务器端出错'
                    break
                case 501:
                    error.message = '网络未实现'
                    break
                case 502:
                    error.message = '网络错误'
                    break
                case 503:
                    error.message = '服务不可用'
                    break
                case 504:
                    error.message = '网络超时'
                    break
                case 505:
                    error.message = 'http版本不支持该请求'
                    break
                default:
                    error.message = `连接错误${error.response.status}`
            }
        } else {

            if(error.config) {
                error.message = "服务器连接失败，请重新登录"
                // router.replace({ 
                //     path: '/login', 
                //     query: {redirect: router.currentRoute.fullPath} 
                // }) 
                console.error(`error request url: ${error.config.url}`);
            } else {
                console.error(`bad request url `);
            }
            // 全局网络错误通知
            if(networkStatus === -1) {
                new Vue().$Message.error({
                    content: error.message,
                    duration: 3
                });
                networkStatus = 0;
                setTimeout(() => {
                    networkStatus = -1;
                },3000)
            }
        }
        return Promise.reject(error.message)
    })
}


// global 变为全局变量
Object.assign(global,{
    axios,qs,
    Vue,
    Cookies,
    callbackOfThen,
    callbackOfCatch
});