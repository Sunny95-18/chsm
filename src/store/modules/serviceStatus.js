import conf from '@/conf/'
const serviceStatus = {
    state: {
        loading: false,
        totalCount: 0,
        rows: []
    },
    mutations: {
        serviceShow(state, queryParams) {
            state.loading = true;
            setTimeout(function () {
                var data = [];
                data.push({ type: "加密服务", value: "已启动" });
                data.push({ type: "当前并发数", value: 0 });
                data.push({ type: "内存使用率", value: "25%" });
                state.totalCount = data.length;
                state.rows = data;
                state.loading = false;
            }, 500);
        }
    },
    actions: {
        //获取网口信息
        getNetWork({ commit }) {

            return new Promise((resolve, reject) => {
                axios.get(conf.apiServer + "service/getNetwork", { timeout: 5000 }).then(res => {
                    resolve(res);
                }).catch(err => {
                    console.log(err.response)
                    reject(err);
                });
            })
        },
        //修改网口信息
        editNetwork({ commit }, networkForm) {
            console.log("networkForm:",networkForm)
            const requestData = conf.requestData;
            requestData.data = networkForm;
            return new Promise((resolve, reject) => {
                axios.post(conf.apiServer + "service/networkConfig", requestData, { timeout: 5000 }).then(res => {
                    resolve(res);
                }).catch(err => {
                    console.log(err.response)
                    reject(err);
                });
            })
        },
        //重启网络服务
        restartNetWork({ commit }) {
            return new Promise((resolve, reject) => {
                axios.post(conf.apiServer + "service/restart", { timeout: 5000 }).then(res => {
                    resolve(res);
                }).catch(err => {
                    console.log(err.response)
                    reject(err);
                });
            })
        },
    
        //获取当前服务状态
        getServiceStatus({commit}){
            return new Promise((resolve, reject) => {
                axios.get(conf.apiServer + "service/getServiceStatus", { timeout: 5000 }).then(res => {
                    resolve(res);
                }).catch(err => {
                    console.log(err.response)
                    reject(err);
                });
            })
        },
          //切换服务状态 0：stop,1:run ,2:restart
          changeServiceStatus({ commit }, status) {
            const requestData = conf.requestData;
            requestData.data = status;
            return new Promise((resolve, reject) => {
                axios.post(conf.apiServer + "service/changeServiceStatus", requestData, { timeout: 5000 }).then(res => {
                    resolve(res);
                }).catch(err => {
                    console.log(err.response)
                    reject(err);
                });
            })
        }
    }
};

export default serviceStatus;
