import conf from '@/conf/'
const authCode = {
    state: {
        loading: false,
        totalCount: 0,
        authCoderows: []
    },
    mutations: {
        queryAuthCodeList(state, queryParams) {
            state.loading = true;
            const requestData = conf.requestData;
            requestData.data = {
                current: queryParams.current,
                size: queryParams.size
            }
            console.log("data:",requestData)
            setTimeout(function () {
                axios.post(conf.apiServer + "key/getAllAuthCode", requestData).then(
                    res => {
                        var resData = res.data;
               
                        if (resData.code == 200 && resData.data.data != null) {
                            state.authCoderows = [];
                            state.authCoderows = resData.data.data;
                            state.totalCount = resData.data.total;
                        } else {
                            state.authCoderows = [];
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
        //修改私钥授权码
        updateAuthCode({ commit }, updateForm) {
            const data=new FormData();
            data.append("id",updateForm.id);
            data.append("authCode",updateForm.newAuthCode);
            data.append("confirmAuthCode",updateForm.confirmAuthCode);
            return new Promise((resolve, reject) => {
                axios.post(conf.apiServer + "key/updateAuthCode", data, { timeout: 5000 }).then(res => {
                    resolve(res);
                }).catch(err => {
                    console.log(err.response)
                    reject(err);
                });
            })
        },
     
    }
};

export default authCode;
