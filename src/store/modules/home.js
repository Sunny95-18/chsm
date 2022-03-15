import conf from '@/conf/'
const home = {
    state: {
        loading: false,
        totalCount: 0,
        rows: []
    },
    mutations: {  
    },
    actions: {
        //获取设备系统信息
        getDeviceInfo({ commit }) {
            return new Promise((resolve, reject) => {
                axios.get(conf.apiServer + "home/getDeviceInfo", { timeout: 15000 }).then(res => {
                    resolve(res);
                }).catch(err => {
                    console.log(err.response)
                    reject(err);
                });
            })
        },
        //获取用户访问量统计数据
        getVisitData({commit }){
            return new Promise((resolve, reject) => {
                axios.get(conf.apiServer + "home/getVisit", { timeout: 5000 }).then(res => {
                    resolve(res);
                }).catch(err => {
                    console.log(err.response)
                    reject(err);
                });
            })
        },

           //获取面板上的信息
           getPanelInfo({commit }){
            return new Promise((resolve, reject) => {
                axios.get(conf.apiServer + "home/getPanelInfo", { timeout: 15000 }).then(res => {
                    resolve(res);
                }).catch(err => {
                    console.log(err.response)
                    reject(err);
                });
            })
        }
    
       
       
    }
};

export default home;
