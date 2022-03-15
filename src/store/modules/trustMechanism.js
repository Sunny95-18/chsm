import conf from '@/conf/'
const trustMechanism = {
    state: {
        loading: false,
        totalCount: 0,
        rows:[]
    },
    mutations: {
        queryCert(state,queryParams){
            state.loading = true;
            const requestData=conf.requestData;
            requestData.data={
                current:queryParams.current-1,
                size:queryParams.size,
            }
            setTimeout(function() {
                axios.post(conf.apiServer + "ca/getCaCertList", requestData).then(
                    res => {
                        var resData = res.data;
                        if(resData.code==200 && resData.data.data!=null){
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
        }
    },
    actions:{
        import({ commit },inportFile) {
           const data=new FormData();
           data.append("type",inportFile.type);
           data.append("file",inportFile.file)
            return new Promise((resolve, reject) => {
                axios.post(conf.apiServer + "ca/importCaCert",data, {
                    headers: {'Content-Type': 'multipart/form-data'}
                }).then(res => {
                    resolve(res);
                }).catch(err => {
                    console.log(err.response)
                    reject(err);
                });
            });
        },
        deleteCA({ commit },id) {
            const requestData = conf.requestData;
            requestData.data =id;
             return new Promise((resolve, reject) => {
                 axios.post(conf.apiServer + "ca/delete",requestData, {
                     timeout: 5000,
            
                 }).then(res => {
                     resolve(res);
                 }).catch(err => {
                     console.log(err.response)
                     reject(err);
                 });
             });
         },
        detail({ commit },id) {
            const requestData = conf.requestData;
            requestData.data =id;
            return new Promise((resolve, reject) => {
                axios.post(conf.apiServer + "ca/detail",requestData, {
                    timeout: 5000,
                }).then(res => {
                    resolve(res);
                }).catch(err => {
                    console.log(err.response)
                    reject(err);
                });
            });
        },
        download({ commit },id) {
            return new Promise((resolve, reject) => {
                axios.get(conf.apiServer + "ca/download/"+id, {
                    responseType: 'blob',
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

export default trustMechanism;