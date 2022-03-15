import conf from '@/conf/'
const system = {
    state: {
        loading: false,
        rows: []
    },
    mutations: {   
        loadDeviceData(state) {
            state.loading = true;
            var data = [];
            setTimeout(function() {
                axios.get(conf.apiServer + "system/getSystemInfo").then(
                    res => {
                        var resData = res.data;
                            if (resData.code == 200 && resData.data != null) {
                                data.push({key:"生产厂商",value:resData.data.manufacturer});
                                data.push({key:"设备型号",value:resData.data.model});
                                data.push({key:"产品号",value:resData.data.product});
                                data.push({key:"设备序列号",value:resData.data.serialNumber});
                                data.push({key:"设备版本",value:resData.data.version});
                                state.rows = data;
                            } else {
                                data.push({key:"生产厂商",value:"BLXIC"});
                                data.push({key:"设备型号",value:"SZLX-SVS"});
                                data.push({key:"产品号",value:"SZLX-SVS"});
                                data.push({key:"设备序列号",value:"2020092712870090"});
                                data.push({key:"设备版本",value:"1.0"});
                                state.rows = data;
                                state.totalCount = 0;
                            }
                    }).catch(err => {
                        console.error(err);
                    }).then(() => {
                        state.loading = false;
                    });
              
                
                state.rows = data;
                state.loading = false;
            },500);
        }     
    },
    actions:{
        getNTPdate({ commit }) {
            return new Promise((resolve, reject) => {
                axios.get(conf.apiServer + "system/getSystimeDateAndNTPDate", {
                    timeout: 5000,
                }).then(res => {
                    resolve(res);
                }).catch(err => {
                    console.log(err.response)
                    reject(err);
                });
            });

        },
        //设置系统时间
        setDate({ commit },date) {
            const requestData = conf.requestData;
            requestData.data =date;
            return new Promise((resolve, reject) => {
                axios.post(conf.apiServer + "system/updateDate",requestData, {
                    timeout: 5000,
                }).then(res => {
                    resolve(res);
                }).catch(err => {
                    console.log(err.response)
                    reject(err);
                });
            });
        },
        setNtp({ commit },ntpForm) {
            const requestData = conf.requestData;
            requestData.data ={
                ip:ntpForm.ip,
                port:ntpForm.port,
                interval:ntpForm.interval
            };
            return new Promise((resolve, reject) => {
                axios.post(conf.apiServer + "system/updateNTP",requestData, {
                    timeout: 5000,
                }).then(res => {
                    resolve(res);
                }).catch(err => {
                    console.log(err.response)
                    reject(err);
                });
            });
        },
        //设备自检
        deviceRunInfo({ commit }) {
            return new Promise((resolve, reject) => {
                axios.get(conf.apiServer + "system/systemRunInfo", {
                    timeout: 20000,
                }).then(res => {
                    resolve(res);
                }).catch(err => {
                    console.log(err.response)
                    reject(err);
                });
            });
        },
           //系统初始化
           systemInit({ commit }) {
            return new Promise((resolve, reject) => {
                axios.post(conf.apiServer + "system/systemInit", {
                    timeout: 20000,
                }).then(res => {
                    resolve(res);
                }).catch(err => {
                    console.log(err.response)
                    reject(err);
                });
            });
        },
        //获取ocsp
        getOCSP({commit}){
            return new Promise((resolve, reject) => {
                axios.get(conf.apiServer + "system/getOCSP", {
                    timeout: 5000,
                }).then(res => {
                    resolve(res);
                }).catch(err => {
                    console.log(err.response)
                    reject(err);
                });
            });
        },
        //设置ocsp
        setOCSP({commit},ocspForm){
            const data=new FormData();
            data.append("url",ocspForm.url);
            data.append("port",ocspForm.port);
            return new Promise((resolve, reject) => {
                axios.post(conf.apiServer + "system/setOCSP",data, {
                    timeout: 5000,
                }).then(res => {
                    resolve(res);
                }).catch(err => {
                    console.log(err.response)
                    reject(err);
                });
            });
        },
        //系统升级
        systemUpgrade({commit},file){
            const data=new FormData();
            data.append("file",file);
            return new Promise((resolve, reject) => {
                axios.post(conf.apiServer + "system/update",data, {
                    headers: {'Content-Type': 'multipart/form-data'},
                }).then(res => {
                    resolve(res);
                }).catch(err => {
                    console.log(err.response)
                    reject(err);
                });
            });
        }
    }

}


export default system;