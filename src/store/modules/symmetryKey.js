import conf from '@/conf/'
const symmetryKey = {
    state: {
        loading: false,
        totalCount: 0,
        rows: [],
    },
    mutations: {
        querySymmetryKeyList(state){
            state.loading = true;
            let requestData = {}
            requestData.data =1;
            axios.post(conf.apiServer + "key/getKeyList", requestData).then(
                res => {
                    var resData = res.data;
                        if (resData.code == 200 && resData.data != null) {
                            state.rows = resData.data;
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
        },
    },
    actions:{
        SymmetryKeyGeneration({ commit }, createKey) {
            const data=new FormData();
            data.append("keyType",createKey.type);
            data.append("keyIndex",createKey.index)
            data.append("keyLength",createKey.length)
            data.append("usage",createKey.usage)
            return new Promise((resolve, reject) => {
                axios.post(conf.apiServer + "key/KeyGeneration", data, {
                    timeout: 5000,
                }).then(res => {
                    resolve(res);
                }).catch(err => {
                    console.log(err.response)
                    reject(err);
                });
            });

        },
        deleteSymmetryKey({ commit }, deleteKey) {
            const data=new FormData();
            data.append("keyType",1);
            data.append("keyIndex",deleteKey.id)
            data.append("usage",deleteKey.usage)
            return new Promise((resolve, reject) => {
                axios.post(conf.apiServer + "key/deleteKey", data, {
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
};

export default symmetryKey;