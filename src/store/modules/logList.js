import conf from '@/conf/'
const logList = {
    state: {
        loading: false,
        totalCount: 0,
        rows: []
    },
    mutations: {
        queryAllLog(state) {
            state.loading = true;
            setTimeout(function() {
                axios.post(conf.apiServer + "log/backup").then(
                    res => {
                        var resData = res.data;
                        if(resData.code==200 && resData.data!=null){
                        state.rows = resData.data.data;
                        state.totalCount =resData.data.total;
                        }else{
                            state.rows=[];
                            state.totalCount=0;
                        }

                    }).catch(err => {
                        console.error(err);
                    }).then(() => {
                        state.loading = false;
                    });
            },500);
        },
        queryAllLogPage(state,queryParams){
            state.loading = true;
            const requestData=conf.requestData;
            requestData.data={
                current:queryParams.current-1,
                size:queryParams.size,
                logType:queryParams.logType
            
            };
            setTimeout(function() {
                axios.post(conf.apiServer + "log/getLogPage", requestData).then(
                    res => {
                        var resData = res.data;
                        if(resData.code==200 && resData.data!=null){
                        state.rows = resData.data.data;
                        state.totalCount =resData.data.total;
                        }else{
                            state.rows=[];
                            state.totalCount=0;
                        }

                    }).catch(err => {
                        console.error(err);
                    }).then(() => {
                        state.loading = false;
                    });
            },500);
        },
      
    },
    actions: {
        //设置日志级别
        setLogLevel({ commit }, level) {
            return new Promise((resolve, reject) => {
                const requestData = conf.requestData;
                requestData.data = level;

                axios.post(conf.apiServer + "log/setLogLevel", requestData, { timeout: 5000 }).then(res => {
                    resolve(res);
                }).catch(err => {
                    console.log(err.response)
                    reject(err);
                });
            })
        },
        //删除日志
        deleteLogs({ commit }, ids) {
            return new Promise((resolve, reject) => {
                const requestData = conf.requestData;
                requestData.data = ids;

                axios.post(conf.apiServer + "log/delete", requestData, { timeout: 5000 }).then(res => {
                    resolve(res);
                }).catch(err => {
                    console.log(err.response)
                    reject(err);
                });
            })
        },
          //日志审计
          verifyLog({ commit }, ids) {
            return new Promise((resolve, reject) => {
                const requestData = conf.requestData;
                requestData.data = ids;

                axios.post(conf.apiServer + "log/verify", requestData, { timeout: 5000 }).then(res => {
                    resolve(res);
                }).catch(err => {
                    console.log(err.response)
                    reject(err);
                });
            })
        },
        exportExcel({ commit }){
            return new Promise((resolve, reject) => {
                axios.get(conf.apiServer + "log/backup", {responseType: 'blob'}).then(res => {
                    resolve(res);
                }).catch(err => {
                    console.log(err.response)
                    reject(err);
                });
            });
          
        }
    }
};

export default logList;
