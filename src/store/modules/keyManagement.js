import conf from '@/conf/'
const keyManagement = {
    state: {
        loading: false,
        totalCount: 0,
        rows: [],
    },
    mutations: {

    },
    actions:{
        initDevice({ commit }) {
            return new Promise((resolve, reject) => {
                axios.post(conf.apiServer + "key/init", {
                    timeout: 5000,
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

export default keyManagement;