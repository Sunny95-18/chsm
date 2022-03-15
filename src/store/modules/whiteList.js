import conf from '@/conf/'
const whiteList = {
    state: {
        loading: false,
        totalCount: 0,
        rows: []
    },
    mutations: {
        getWhiteList(state, queryParams) {
            state.loading = true;
            const requestData = conf.requestData;
            requestData.data = {
                current: queryParams.current,
                size: queryParams.size,
            }
            setTimeout(function () {
                axios.post(conf.apiServer + "whiteList/getWhiteList", requestData).then(
                    res => {
                        var resData = res.data;
                        if (resData.code == 200 && resData.data != null) {
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
        add({ commit }, ip) {
            const requestData = conf.requestData;
            requestData.data = ip;
            return new Promise((resolve, reject) => {
                axios.post(conf.apiServer + "whiteList/addWhitehost", requestData, {
                    timeout: 5000,
                }).then(res => {
                    resolve(res);
                }).catch(err => {
                    console.log(err.response)
                    reject(err);
                });
            });
        },
        deleteIP({ commit }, id) {
            const requestData = conf.requestData;
            requestData.data = id;
            return new Promise((resolve, reject) => {
                axios.post(conf.apiServer + "whiteList/delWhitehost", requestData, {
                    timeout: 5000,
                }).then(res => {
                    resolve(res);
                }).catch(err => {
                    console.log(err.response)
                    reject(err);
                });
            });

        }
    }
};

export default whiteList;
