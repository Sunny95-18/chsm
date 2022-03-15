import conf from '@/conf/'
const backupKey = {
    state: {
        loading: false,
        totalCount: 0,
        rows: []
    },
    mutations: {
        showLoginStatus(state,queryParams) {
            state.loading = true;
            state.rows=[];
            setTimeout(function () {
                axios.post(conf.apiServer + "auth/getPrivilege").then(
                    res => {
                        var resData = res.data;
                        if (resData.code == 200 && resData.data != null) {
                            var data=[];
                            data.push({type:"当前权限状态",value:resData.data.permission});
                            data.push({type:"管理员数目",value:resData.data.managerCount});
                            data.push({type:"已登录管理员",value:resData.data.managerLoginInfo});
                            state.rows=data;
                            state.totalCount = data.length;
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
        }
    },
    actions:{
        exportKey({ commit }, exportKey) {
            const data=new FormData();
            data.append("part",exportKey.part);
            data.append("pin",exportKey.pin);
            return new Promise((resolve, reject) => {
                axios.post(conf.apiServer + "key/exportKey", data, {
                }).then(res => {
                    resolve(res);
                }).catch(err => {
                    console.log(err.response)
                    reject(err);
                });
            });

        },
        exportFile({ commit }) {
            return new Promise((resolve, reject) => {
                axios.get(conf.apiServer + "key/downloadBackFile", {
                responseType: 'blob',
                }).then(res => {
                    resolve(res);
                }).catch(err => {
                    console.log(err.response)
                    reject(err);
                });
            });

        },
        importFile({commit},file){
            const data=new FormData();
            data.append("file",file);
            return new Promise((resolve, reject) => {
                axios.post(conf.apiServer + "key/uploadBackFile", data, {
                }).then(res => {
                    resolve(res);
                }).catch(err => {
                    console.log(err.response)
                    reject(err);
                });
            });
        },
        checkRecoveryFile({commit}){
            return new Promise((resolve, reject) => {
                axios.get(conf.apiServer + "key/checkRecoveryFile", {
                }).then(res => {
                    resolve(res);
                }).catch(err => {
                    console.log(err.response)
                    reject(err);
                });
            });
        },
        inputKey({commit},inputKeys){
            const data=new FormData();
            data.append("part",inputKeys.part);
            data.append("pin",inputKeys.pin);
            return new Promise((resolve, reject) => {
                axios.post(conf.apiServer + "key/importManagerKey", data, {
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

export default backupKey;
