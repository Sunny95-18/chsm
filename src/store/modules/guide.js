import conf from '@/conf/'
const guide = {
    state: {
        loading: false,
        totalCount: 0,
        rows: []
    },
    mutations: {
        RsaList(state,queryParams) {
            state.loading = true;
            setTimeout(function() {
                var totalCount = parseInt((Math.random() * 10000) % 10);
                var data = [];
                for(var i = 0 ; i < totalCount; i++) {
                    data.push({
                        id: i+1,
                        type:"签名密钥",
                        length: 1024
                    });
                    data.push({
                        id: i+1,
                        type:"加密密钥",
                        length: 1024
                    });
               
                }
                state.totalCount = totalCount;
                state.rows = data;
                state.loading = false;
            },500);
        },
        EccList(state,queryParams) {
            state.loading = true;
            setTimeout(function() {
                var totalCount = parseInt((Math.random() * 10000) % 10);
                var data = [];
                for(var i = 0 ; i < totalCount; i++) {
                    data.push({
                        id: i+1,
                        type:"签名密钥",
                        length: 256
                    });
                    data.push({
                        id: i+1,
                        type:"加密密钥",
                        length: 256
                    });
               
                }
                state.totalCount = totalCount;
                state.rows = data;
                state.loading = false;
            },500);
        },
        SymmetricList(state,queryParams) {
            state.loading = true;
            setTimeout(function() {
                var totalCount = parseInt((Math.random() * 10000) % 10);
                var data = [];
                for(var i = 0 ; i < totalCount; i++) {
                    data.push({
                        id: i+1,
                        length: 128
                    });
               
                }
                state.totalCount = totalCount;
                state.rows = data;
                state.loading = false;
            },500);
        }
    }
};

export default guide;
