axios.interceptors.response.use(function (response) { 
    // 用户信息是否超时，重定向到登录页面 

    if (response.data.errorMsg== '请登录'){ 
        localStorage.clear() 
        router.replace({ 
            path: '/login', 
            query: {redirect: router.currentRoute.fullPath} 
        }) 
    } 
    return response 
}, function (error) { 
  
    return Promise.reject(error) 
})


// axios.interceptors.request.use(function (config) {
//     // 在发送请求之前做些什么
//     return config;
//   }, function (error) {
//     // 对请求错误做些什么
//     return Promise.reject(error);
// });