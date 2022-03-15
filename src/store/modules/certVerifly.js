import conf from '@/conf/'
const certVerifly = {
    actions:{
        getCertVerifly({ commit }) {
            return new Promise((resolve, reject) => {
                axios.get(conf.apiServer + "cert/getCertVeriflyMethod", {
                    timeout: 5000,
                }).then(res => {
                    resolve(res);
                }).catch(err => {
                    console.log(err.response)
                    reject(err);
                });
            });

        },
        setCertVerifly({ commit },type) {
            const requestData = conf.requestData;
            requestData.data =type;
            return new Promise((resolve, reject) => {
                axios.post(conf.apiServer + "cert/setCertVeriflyMethod",requestData, {
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


export default certVerifly;