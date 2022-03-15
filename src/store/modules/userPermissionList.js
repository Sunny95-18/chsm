import conf from '@/conf/'
const userPermissionList = {
    state: {
        loading: false,
        totalCount: 0,
        rows: []
    },
    mutations: {
        permissionList(state,queryParams) {
            state.loading = true;
            
            setTimeout(function() {
                axios.post(conf.apiServer + "auth/getPrivilegeList", { timeout: 5000 }).then(
                    res => {
                        var resData = res.data;
                        state.rows = resData.data;
                        state.totalCount = resData.data.length;

                    }).catch(err => {
                        console.error(err);
                    }).then(() => {
                        state.loading = false;
                    });
            },500);
        }
    }
};

export default userPermissionList;
