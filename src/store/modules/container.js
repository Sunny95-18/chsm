import conf from '@/conf/'
const container = {
    state: {
        loading: false,
        totalCount: 0,
        rows: []
    },
    mutations: {
        containerList(state, queryParams) {
            state.loading = true;
            const requestData = conf.requestData;
            requestData.data = {
                current: queryParams.current - 1,
                size: queryParams.size,

            };
            setTimeout(function () {
                axios.post(conf.apiServer + "container/getContainerPage", requestData).then(
                    res => {
                        var resData = res.data;
                        if (resData.code == 200 && resData.data.data != null) {
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
        }
    },
    actions: {
        //创建应用实体
        createContainer({ commit }, containerForm) {
            const requestData = conf.requestData;
            requestData.data = {
                name: containerForm.name,
                keyType: containerForm.algType,
                keyIndex: containerForm.keyIndex,
                authCode:containerForm.authCode,
                confirmAuthCode:containerForm.confirmAuthCode
            };
            return new Promise((resolve, reject) => {
                axios.post(conf.apiServer + "container/createContainer", requestData, { timeout: 5000 }).then(res => {
                    resolve(res);
                }).catch(err => {
                    console.log(err.response)
                    reject(err);
                });
            })
        },
        //修改应用实体
        editContainer({ commit }, editContainer) {
            const requestData = conf.requestData;
            requestData.data = {
                id: editContainer.id,
                name: editContainer.name,
                keyIndex: editContainer.keyIndex,
                keyType:editContainer.algType,
                keyLength:editContainer.keyLength
            };
            return new Promise((resolve, reject) => {
                axios.post(conf.apiServer + "container/edit", requestData, { timeout: 5000 }).then(res => {
                    resolve(res);

                }).catch(err => {
                    console.log(err.response)
                    reject(err);
                });
            })
        },
        //创建证书  { responseType: 'blob' }
        applyP10Cert({ commit }, p10Cert) {
            const requestData = conf.requestData;
            requestData.data = p10Cert;
            return new Promise((resolve, reject) => {
                axios.post(conf.apiServer + "container/createP10Cert", requestData,{
                    responseType: 'blob',
                }).then(res => {
                    resolve(res);
                }).catch(err => {
                    console.log(err.response)
                    reject(err);
                });
            })
        },
        //导入证书
        importCert({ commit }, importCertForm) {
            const data=new FormData();
            data.append("id",importCertForm.id)
            data.append("type",importCertForm.type)
            data.append("file",importCertForm.file)
            return new Promise((resolve, reject) => {
                axios.post(conf.apiServer + "container/importCert", data).then(res => {

                    resolve(res);
                }).catch(err => {
                    console.log(err.response)
                    reject(err);
                });
            })
        },

        //删除应用实体
        deleteContainer({ commit }, id) {
            const requestData = conf.requestData;
            requestData.data = id;
            return new Promise((resolve, reject) => {
                axios.post(conf.apiServer + "container/delete", requestData, { timeout: 5000 }).then(res => {
                    resolve(res);
                }).catch(err => {
                    console.log(err.response)
                    reject(err);
                });
            })
        },
    }
};

export default container;
