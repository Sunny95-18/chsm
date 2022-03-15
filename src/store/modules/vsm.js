import conf from '@/conf/'

const vsm = {
    state: {
        loading: false,
        totalCount: 0,
        rows: []
    },
    mutations: {
        queryVsmList(state) {
            state.loading = true;

            state.row = [];
            setTimeout(function () {
                axios.get(conf.apiServer + "vsm/getVirtStatus").then(
                    res => {
                        var resData = res.data;
                        if (resData.code == 200 && resData.data != null) {
                            state.row = [];
                            state.rows = resData.data.data;
                            state.totalCount = resData.data.total;
                        } else {
                            state.rows = [];
                            state.totalCount = 0;
                        }
                    }).catch(err => {
                        console.error(err);
                    }).then(() => {
                        state.loading = false;
                    });
            }, 500);
        },
    },
    actions: {
        //切换虚拟机状态
        changeVSMStatus({ commit }, changeInfo) {
            const requestData = conf.requestData;
            requestData.data = changeInfo;

            return new Promise((resolve, reject) => {
                axios.post(conf.apiServer + "vsm/changeVsmStatus", requestData, { timeout: 5000 }).then(res => {
                    resolve(res);
                }).catch(err => {
                    console.log(err.response)
                    reject(err);
                });
            })
        },
        //根据ip获取虚拟机信息
        getVsmIp({ commit }, ip) {
            const requestData = conf.requestData;
            requestData.data = ip;

            return new Promise((resolve, reject) => {
                axios.post(conf.apiServer + "vsm/getVsmByIP", requestData, { timeout: 5000 }).then(res => {
                    resolve(res);
                }).catch(err => {
                    console.log(err.response)
                    reject(err);
                });
            })
        },
    }
};

export default vsm;
