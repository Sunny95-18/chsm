import conf from '@/conf/'

const adminUserManagement = {
    state: {
        loading: false,
        totalCount: 0,
        rows: []
    },
    mutations: {
        querAdminList(state, queryParams) {
            state.loading = true;
            const requestData = conf.requestData;
            requestData.data = {
                current: queryParams.current - 1,
                size: queryParams.size
            }
            state.row = [];
            setTimeout(function () {
                axios.post(conf.apiServer + "user/selectUsers", requestData).then(
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
        queryManager(state, queryParams) {
            state.loading = true;
            state.rows=[];
            setTimeout(function () {
                axios.post(conf.apiServer + "auth/getPrivilege").then(
                    res => {
                        var resData = res.data;
                        if (resData.code == 200 && resData.data != null) {
                            state.row = [];
                            state.rows.push(resData.data);
                            state.totalCount = 1;
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
        loadLoginData(state, queryParams) {
            state.loading = true;
            setTimeout(function () {
                var totalCount = 3;
                var data = [];
                for (var i = 1; i <= totalCount; i++) {
                    data.push({
                        id: i,
                        status: 1
                    });

                }
                state.totalCount = totalCount;
                state.rows = data;
                state.loading = false;
            }, 500);
        },
    },
    actions: {
        //用户注册
        createUser({commit},createUserForm) {
            const requestData = conf.requestData;
            requestData.data = createUserForm;
    
            return new Promise((resolve, reject) => {
                axios.post(conf.apiServer + "user/register", requestData, { timeout: 5000 }).then(res => {
                    resolve(res);
                }).catch(err => {
                    console.log(err.response)
                    reject(err);
                });
            })
        },
        //删除用户
        deleteSystemUser({ commit }, serialNumber) {
            const requestData = conf.requestData;
            requestData.data = serialNumber;
            return new Promise((resolve, reject) => {
                axios.post(conf.apiServer + "user/delete", requestData, { timeout: 5000 }).then(res => {
                    resolve(res);
                }).catch(err => {
                    console.log(err.response)
                    reject(err);
                });
            })
        },
        //修改用户口令
        updatePassword({ commit }, formCustom) {
            const requestData = conf.requestData;
            requestData.data = formCustom;
            return new Promise((resolve, reject) => {
                axios.post(conf.apiServer + "auth/updatePwd", requestData, { timeout: 5000 }).then(res => {
                    resolve(res);
                }).catch(err => {
                    console.log(err.response)
                    reject(err);
                });
            })
        },
        //修改用户状态
        // updateUserStatus({ commit },userStatus) {
        //     const requestData = conf.requestData;
        //     requestData.data = {
        //        id:userStatus.id,
        //        status:userStatus.status
        //     };
        //     return new Promise((resolve, reject) => {
        //         axios.post(conf.apiServer + "auth/addUser", requestData, { timeout: 5000 }).then(res => {
        //             resolve(res);
        //         }).catch(err => {
        //             console.log(err.response)
        //             reject(err);
        //         });
        //     })
        // },
        //UKey--管理员或操作员登录
        managerLogin({ commit }, pin) {
            const requestData = conf.requestData;
            requestData.data = pin;
            return new Promise((resolve, reject) => {
                axios.post(conf.apiServer + "auth/managerLogin", requestData, { timeout: 5000 }).then(res => {
                    resolve(res);
                }).catch(err => {
                    console.log(err.response)
                    reject(err);
                });
            })
        },
        //UKey--注销管理员或操作员
        managerLogout({ commit }, userId) {
            const requestData = conf.requestData;
            requestData.data = userId;
            return new Promise((resolve, reject) => {
                axios.post(conf.apiServer + "auth/managerLogout", requestData, { timeout: 5000 }).then(res => {
                    resolve(res);
                }).catch(err => {
                    console.log(err.response)
                    reject(err);
                });
            })
        },
    }
};

export default adminUserManagement;
