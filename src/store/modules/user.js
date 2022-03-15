import { setToken, getToken, removeToken } from '@/utils/token'
import conf from '@/conf/'
export default {
    state: {
        userName: '测试用户',
        userId: 'super_admin',
        loginName: '',
        avatarImgPath: '',
        token: getToken(),
        access: '0',
        hasGetInfo: false,
        roles: [],
        nodeInfoId: -1,
        nodeName: null,
        currentHost: null,
        isMaster: false,
        rows:[],
        totalCount:0
    },
    mutations: {
        // 初始化工作
        userInit(state) {
            if (!state.token) {
                return;
            }
            this.dispatch("getUserInfo").then(res => {
                var resData = res.data;
                if (resData.code == 200) {
                    state.loginName = resData.data.serialNumber;
                    state.hasGetInfo = true;
                    // this.commit("loadVmList", state.loginName);
                }
            }).catch(err => {

            });
        },
        // 设置头像
        setAvatar(state, avatarPath) {
            state.avatarImgPath = avatarPath
        },
        // 设置用户id
        setUserId(state, id) {
            state.userId = id
        },
        // 设置用户名称
        setUserName(state, name) {
            state.loginName = name
        },
        // 设置token信息
        setToken(state, token) {
            state.token = token
            setToken(token)
        },
        //设置用户权限
        setRoles: (state, roles) => {
            state.roles = roles
        },
        setHasGetInfo(state, status) {
            state.hasGetInfo = status
        },
        userChangePasswd(state, pwdFormData) {
            const requestData = conf.requestData;
            requestData.data = pwdFormData;
            axios.post(conf.writeApiServer + "auth/updatePwd", requestData).then(
                res => {
                    // if (callback) {
                    //     console.log(res.data);
                    //     if (!res.data || (res.data && res.data.code == conf.responseCodes.success)) {
                    //         callback();
                    //     } else {
                    //         callback(res.data.description || res.data.msg || "服务端错误");
                    //     }
                    // }
                }).catch(err => {
                    console.error(err);
                    if (callback) {
                        callback(err);
                    }
                });
        },
        getAllSysUser(state,queryParm){
            const requestData = conf.requestData;
            requestData.data=queryParm;
            axios.post(conf.writeApiServer + "auth/findAllSysUser", requestData).then(
                res => {
                      const resData=res.data.data;
                    state.rows=resData.data;
                    state.totalCount=resData.total;
                    // console.log("total:",resData)
                //   resolve(res);
                }).catch(err => {
                    console.error(err);
                    if (callback) {
                        callback(err);
                    }
                });
        }
    },
    actions: {
        //检查是否初始化
        checkInit({ commit }) {
            return new Promise((resolve, reject) => {
                axios.get(conf.apiServer + "user/checkInit", { timeout: 5000 }).then(res => {
                    resolve(res);
                }).catch(err => {
                    console.log(err.response)
                    reject(err);
                });
            })
        },
        handleAuth({ commit }, authInfo) {
            return new Promise((resolve, reject) => {
                const requestData = conf.requestData;
                requestData.data = authInfo;
                axios.post(conf.apiServer + "user/auth", requestData, { timeout: 10000 }).then(res => {
                    resolve(res);
                }).catch(err => {
                    console.log("login:",err)
                    reject(err);
                });
            })
        },
        // 登录
        handleLogin({ commit }, loginInfo) {
            return new Promise((resolve, reject) => {
                const requestData = conf.requestData;
                requestData.data = loginInfo;
                axios.post(conf.apiServer + "user/login", requestData, { timeout: 10000 }).then(res => {
                    resolve(res);
                }).catch(err => {
                    console.log("login:",err)
                    reject(err);
                });
            })
        },
        // 退出登录
        handleLogOut({ state, commit }) {
            return new Promise((resolve, reject) => {
                // 清除Token
                removeToken();
                // 清除权限
                Cookies.remove("access");
                resolve();
            })
        },
        // 获取用户相关信息,null,{headers:{'Access-Control-Allow-Origin': '*'}}
        getUserInfo({ state, commit }) {
            return new Promise((resolve, reject) => {
                axios.get(conf.apiServer + "user/getUserInfo").then(res => {

                    // state.loginName=res.data.data.username;
                    resolve(res);
                })
                    .catch(err => {
                        console.log(err.response)
                        reject(err);
                    });
            })
        },
        // 动态修改权限
        ChangeRoles({ commit }, role) {
            return new Promise(resolve => {
                commit('setRoles', role)
                setToken(role)
                getUserInfo(role).then(response => {
                    const data = response
                    commit('setRoles', data.roles)
                    resolve()
                })
            })
        },
           // 添加用户
           addUser({ commit }, user) {
            const requestData = conf.requestData;
            requestData.data=user;
            return new Promise(resolve => {
                axios.post(conf.apiServer + "auth/addUser",requestData).then(res => {
                    resolve(res);
                })
                    .catch(err => {
                        console.log(err.response)
                        reject(err);
                    });
            })
        },
          // 修改用户状态
          changUserStatus({ commit }, userStatus) {
            const requestData = conf.requestData;
            requestData.data=userStatus;
            return new Promise(resolve => {
                axios.post(conf.apiServer + "auth/updateUser",requestData).then(res => {
                    resolve(res);
                })
                    .catch(err => {
                        console.log(err.response)
                        reject(err);
                    });
            })
        },
          // 删除用户
          deleteUser({ commit }, id) {
            const requestData = conf.requestData;
            requestData.data=id;
            return new Promise(resolve => {
                axios.post(conf.apiServer + "auth/delete",requestData).then(res => {
                    resolve(res);
                })
                    .catch(err => {
                        console.log(err.response)
                        reject(err);
                    });
            })
        },
         //根据id获取用户
         getUserById({ commit }, id) {
            const requestData = conf.requestData;
            requestData.data=id;
            return new Promise(resolve => {
                axios.post(conf.apiServer + "auth/getUserById",requestData).then(res => {
                    resolve(res);
                })
                    .catch(err => {
                        console.log(err.response)
                        reject(err);
                    });
            })
        },
    }
}
