import conf from '@/conf/'
import { getToken } from '@/utils/token'

const headers = {}
headers["Authorization"] = getToken();
const sginAdnEncryCert = {
    state: {
        loading: false,
        totalCount: 0,
        rows: [],
        uploadUrl:conf.apiServer + "cert/upload",
        hearders:headers
    },
    mutations: {
        querCrlList(state,queryParams) {
           
            state.loading = true;
            const requestData={};
   
    
            requestData.data = {
                type:queryParams.type,
                current: queryParams.current,
                size: queryParams.size
           
            }
            setTimeout(function() {
                axios.post(conf.apiServer + "cert/getCertPage", requestData).then(
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
    actions:{
        upload({ commit},uploadData ){
       const data=new FormData();
        data.append("file",uploadData.file);
        data.append("certName",uploadData.certName);
        data.append("certType",uploadData.type); //1表示加密证书，2表示签名证书，
            return new Promise((resolve, reject) => {
                axios.post(conf.apiServer + "cert/upload1",data,{
                    timeout: 10000,
                    headers: {'Content-Type': 'multipart/form-data'}
                        
                }).then(res => {
                    resolve(res);
                }).catch(err => {
                    console.log(err.response)
                    reject(err);
                });
            });
          
        },
        //删除
        delete({ commit},id ){
            const requestData=conf.requestData;
            requestData.data=id;
                 return new Promise((resolve, reject) => {
                     axios.post(conf.apiServer + "cert/delete",requestData,{
                         timeout: 5000,             
                     }).then(res => {
                         resolve(res);
                     }).catch(err => {
                         console.log(err.response)
                         reject(err);
                     });
                 });
               
             },
             getAsymmetricKeyIndex({ commit},type ){
                const requestData=conf.requestData;
                requestData.data=type;
                     return new Promise((resolve, reject) => {
                         axios.post(conf.apiServer + "key/getAsymmetricKeyIndex",requestData,{
                             timeout: 15000,             
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


export default sginAdnEncryCert;