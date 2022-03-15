import conf from '@/conf/'
const crlManagement = {
    state: {
        loading: false,
        totalCount: 0,
        rows: []
    },
    mutations: {
        quercrlList(state, queryParams) {
            state.loading = true;
            const requestData = conf.requestData;
            requestData.data = {
                current: queryParams.current,
                size: queryParams.size
            };
            setTimeout(function () {

                axios.post(conf.apiServer + "crl/getCrlList", requestData).then(
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
    actions:{
        addCrl({ commit }, addCrlForm) {
            const data=new FormData();
            data.append("file",addCrlForm.file);
            data.append("url",addCrlForm.url);
            data.append("type",addCrlForm.type); //0表示文件添加，1表示地址添加
            return new Promise((resolve, reject) => {
                axios.post(conf.apiServer + "crl/addCrl", data, {
                    timeout: 5000,
                    headers: {'Content-Type': 'multipart/form-data'}
                }).then(res => {
                    resolve(res);
                }).catch(err => {
                    console.log(err.response)
                    reject(err);
                });
            });

        },
        deleteCrl({ commit }, id) {
            const requestData = conf.requestData;
            requestData.data =id;
            return new Promise((resolve, reject) => {
                axios.post(conf.apiServer + "crl/delete", requestData, {
                    timeout: 5000,
                }).then(res => {
                    resolve(res);
                }).catch(err => {
                    console.log(err.response)
                    reject(err);
                });
            });

        },
        editCrl({ commit }, editCrlFrom) {
            const requestData = conf.requestData;
            requestData.data ={
                id:editCrlFrom.id,
                url:editCrlFrom.url
            };
            return new Promise((resolve, reject) => {
                axios.post(conf.apiServer + "crl/update", requestData, {
                    timeout: 5000,
                }).then(res => {
                    resolve(res);
                }).catch(err => {
                    console.log(err.response)
                    reject(err);
                });
            });

        },
    }

}


export default crlManagement;