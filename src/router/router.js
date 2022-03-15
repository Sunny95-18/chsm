//import Main from '@/views/main/Main.vue';
const Main = resolve => require(['@/views/main/Main.vue'], resolve)

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: () => import('@/views/main/login.vue')

};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: () => import('@/views/error-page/404.vue')
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: () => import('@/views/error-page/403.vue')
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: () => import('@/views/error-page/500.vue')
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    // redirect: '/vmList/vmIndex',
    component: Main,
    children: [
        {
            path: 'home', title: '首页', icon: 'md-home', name: 'home_index', component: () => import('@/views/home/home.vue'),
            meta: {
                navShow: true
            }
        },
        {
            path: 'ownspace', title: '个人中心', name: 'ownspace_index',
            meta: {
                navShow: true
            }
        }
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    // {
    //     path: '/guide',
    //     icon: 'md-body',
    //     name: 'index',
    //     title: '安装向导',
    //     component: Main,
    //     meta: {
    //         access: ["0"],
    //         role: ['admin']
    //     },
    //     children: [
    //         {
    //             path: 'index', title: '安装向导', icon: 'md-body', name: 'guide', component: () => import('@/views/guide/index.vue'),
    //             meta: {
    //                 role: ['admin']
    //             },
    //         }
    //     ]
    // },
    // {
    //     path: '/admin-login',
    //     icon: 'md-body',
    //     name: 'admin-login',
    //     title: '用户登录',
    //     component: Main,
    //     meta: {
    //         access: ["0"],
    //         role: ['admin']
    //     },
    //     children: [
    //         {
    //             path: 'index', title: '用户登录', icon: 'md-body', name: 'adminLogin', component: () => import('@/views/adminLogin/index.vue'),
    //             meta: {
    //                 role: ['admin']
    //             },
    //         }
    //     ]
    // },
    // {
    //     path: '/admin',
    //     icon: 'md-cog',
    //     title: '用户登录',
    //     name: 'admin-login',
    //     component: Main,
    //     meta: {
    //         access: ["2"],
    //     },
    //     children: [
    //         {
    //             path: 'adminlogin', title: '用户登录', icon: 'md-body', name: 'user-login', component: () => import('@/views/adminLogin/index'),
    //             meta: {
    //                 access: ["2"]
    //             }
    //         },
            
    //     ]
    // },
    // {
    //     path: '/system-init-management',
    //     icon: 'md-cog',
    //     title: '系统管理',
    //     name: 'system-init',
    //     component: Main,
    //     meta: {
    //         access: ["-1"],
    //     },
    //     children: [
    //         {
    //             path: 'deviceInit', title: '设备初始化', icon: 'md-infinite', name: 'device-init', component: () => import('@/views/system-management/deviceInit'),
    //             meta: {
    //                 access: ["-1"]
    //             }
    //         },
    //     ]
    // },
    {
        path: '/admin-management',
        icon: 'md-contacts',
        title: '管理员管理',
        name: 'admin-management',
        component: Main,
        meta: {
            access: ["0"]
        },
        children: [
            {
                path: 'addAdmin', title: '新建管理员', icon: 'md-person-add', name: 'add-admin', component: () => import('@/views/admin-management/createAdmin'),
                meta: {
                    access: ["0"]
                },
            },
            {
                path: 'adminList', title: '管理员列表', icon: 'md-people', name: 'admin-list', component: () => import('@/views/admin-management/adminList'),
                meta: {
                    access: ["0"]
                },
            },


        ]
    },

    //超级管理员部分
    {
        path: '/vsm-management',
        icon: 'md-cog',
        title: 'VSM管理',
        name: 'vsm-management',
        component: Main,
        meta: {
            access: ["1"],
        },
        children: [
            {
                path: 'vsmList', title: '虚拟机列表', icon: 'md-barcode', name: 'vsm-list', component: () => import('@/views/vsm-management/vsmList'),
                meta: {
                    access: ["1"]
                }
            },
            // {
            //     path: 'updatePwd', title: '修改口令', icon: 'md-more', name: 'update-password', component: () => import('@/views/system-management/updatePwd'),
            //     meta: {
            //         access: ["1"]
            //     }
            // },
            // {
            //     path: 'deviceRunInfo', title: '设备自检', icon: 'md-checkmark', name: 'device-run-info', component: () => import('@/views/system-management/deviceRunInfo'),
            //     meta: {
            //         access: ["1"]
            //     }
            // },
            // {
            //     path: 'backupRecovery', title: '备份/恢复', icon: 'logo-python', name: 'backup-recovery', component: () => import('@/views/system-management/backupRecovery'),
            //     meta: {
            //         access: ["1"]
            //     }
            // },
            // {
            //     path: 'systemUpgrade', title: '系统升级', icon: 'md-arrow-round-up', name: 'system-upgrade', component: () => import('@/views/system-management/systemUpgrade'),
            //     meta: {
            //         access: ["1"]
            //     }
            // }
        ]
    },

    // {
    //     path: '/admin-management',
    //     icon: 'md-contacts',
    //     title: '管理员管理',
    //     name: 'admin-management',
    //     component: Main,
    //     meta: {
    //         access: ["6"]
    //     },
    //     children: [
    //         {
    //             path: 'createAdmin', title: '新建管理员', icon: 'md-person-add', name: 'create-admin', component: () => import('@/views/admin-management/createAdmin'),
    //             meta: {
    //                 access: ["6"]
    //             },
    //         },
    //         {
    //             path: 'adminList', title: '管理员列表', icon: 'md-people', name: 'admin-list', component: () => import('@/views/admin-management/adminList'),
    //             meta: {
    //                 access: ["6"]
    //             },
    //         },


    //     ]
    // },
    // {
    //     path: '/authority-management',
    //     icon: 'ios-contact',
    //     title: '权限管理',
    //     name: 'authority-management',
    //     component: Main,
    //     meta: {
    //         access: ["RsaKey"],
    //         role: ['super_editor']
    //     },
    //     children: [
    //         {
    //             path: 'usermanagement', title: '用户管理', icon: 'ios-contacts', name: 'userManagement', component: () => import('@/views/authority-management/userManagement'),
    //             meta: {
    //                 role: ['super_editor']
    //             }
    //         },
    //         {
    //             path: 'updateKey', title: '修改用户口令', icon: 'logo-python', name: 'update-uKey', component: () => import('@/views/authority-management/updateKey'),
    //             meta: {
    //                 role: ['super_editor']
    //             }
    //         },
    //         {
    //             path: 'permissionList', title: '查看权限设置表', icon: 'logo-python', name: 'permission-list', component: () => import('@/views/authority-management/permissionList'),
    //             meta: {
    //                 role: ['super_editor']
    //             }
    //         },

    //     ]
    // },
    // {
    //     path: '/key-management',
    //     icon: 'md-briefcase',
    //     title: '密钥管理',
    //     name: 'key-management',
    //     component: Main,
    //     meta: {
    //         access: ["RsaKey"],
    //         role: ['super_editor']
    //     },
    //     children: [
    //         {
    //             path: 'RsaKey', title: 'RSA密钥管理', icon: 'md-chatboxes', name: 'rsa-key', component: () => import('@/views/key-management/rsaKey'),
    //             meta: {
    //                 role: ['super_editor']
    //             }
    //         },
    //         {
    //             path: 'EccKey', title: 'ECC密钥管理', icon: 'logo-python', name: 'ecc-key', component: () => import('@/views/key-management/eccKey'),
    //             meta: {
    //                 role: ['super_editor']
    //             }
    //         },
    //         {
    //             path: 'symmetricKey', title: '对称密钥管理', icon: 'logo-python', name: 'symmetric-key', component: () => import('@/views/key-management/symmetricKey'),
    //             meta: {
    //                 role: ['super_editor']
    //             }
    //         },
    //         {
    //             path: 'destroyKey', title: '销毁密钥', icon: 'logo-python', name: 'destroy-key', component: () => import('@/views/key-management/destroyKey'),
    //             meta: {
    //                 role: ['super_editor']
    //             }
    //         }

    //     ]
    // },

    //管理员部分菜单权限
    // {
    //     path: '/service-management',
    //     icon: 'md-browsers',
    //     title: '服务管理',
    //     name: 'service-management',
    //     component: Main,
    //     meta: {
    //         access: ["2"],
    //     },
    //     children: [
    //         {
    //             path: 'deviceStatus', title: '设备状态', icon: 'md-more', name: 'service-status', component: () => import('@/views/system-management/deviceStatus'),
    //             meta: {
    //                 access: ["2"],
    //             }
    //         },
    //         {
    //             path: 'systemTimeConfigure', title: '系统时间设置', icon: 'md-time', name: 'sys-time-config', component: () => import('@/views/service-management/sysTimeConfig'),
    //             meta: {
    //                 access: ["2"],
    //             }
    //         },
    //         {
    //             path: 'networkConfigure', title: '网络配置', icon: 'md-git-network', name: 'network-config', component: () => import('@/views/service-management/networkConfigure'),
    //             meta: {
    //                 access: ["2"],
    //             }
    //         },
    //         {
    //             path: 'HAManagement', title: '双机互备', icon: 'logo-python', name: 'ha-management', component: () => import('@/views/service-management/haManagement'),
    //             meta: {
    //                 access: ["2"],
    //             }
    //         },
    //         {
    //             path: 'whiteList', title: '白名单管理', icon: 'md-list', name: 'white-list', component: () => import('@/views/service-management/whiteList'),
    //             meta: {
    //                 access: ["2"],
    //             }
    //         }

    //     ]
    // },
    // {
    //     path: '/key-ca-management',
    //     icon: 'md-key',
    //     title: '密钥&证书管理',
    //     name: 'key-ca-management',
    //     component: Main,
    //     meta: {
    //         access: ["2"],
    //     },
    //     children: [

    //         {
    //             path: 'keyManagement', title: '密钥管理', icon: 'md-key', name: 'key-management', component: () => import('@/views/key-ca-management/keyManagement'),
    //             meta: {
    //                 access: ["2"],
    //             }
    //         },
    //         {
    //             path: 'trustMechanism', title: '受信机构管理', icon: 'md-appstore', name: 'trust-mechanism', component: () => import('@/views/key-ca-management/trustMechanism'),
    //             meta: {
    //                 access: ["2"],
    //             }
    //         },
    //         {
    //             path: 'certVerifyConf', title: '证书验证方式配置', icon: 'md-filing', name: 'cert-verify-conf', component: () => import('@/views/key-ca-management/certVerifyConf'),
    //             meta: {
    //                 access: ["2"],
    //             }
    //         },
    //         {
    //             path: 'crlManagement', title: 'CRL管理', icon: 'md-cart', name: 'crl-management', component: () => import('@/views/key-ca-management/crlManagement'),
    //             meta: {
    //                 access: ["2"],
    //             }
    //         },
    //         {
    //             path: 'ocspManagement', title: 'OCSP管理', icon: 'md-cart', name: 'ocsp-management', component: () => import('@/views/key-ca-management/ocspManagement'),
    //             meta: {
    //                 access: ["2"],
    //             }
    //         },
    //         {
    //             path: 'sginCertManagement', title: '签名证书管理', icon: 'md-card', name: 'sgin-cert-management', component: () => import('@/views/key-ca-management/sginCertManagement'),
    //             meta: {
    //                 access: ["2"],
    //             }
    //         },
    //         {
    //             path: 'encryCertManagement', title: '加密证书管理', icon: 'md-card', name: 'encry-cert-management', component: () => import('@/views/key-ca-management/encryCertManagement'),
    //             meta: {
    //                 access: ["2"],
    //             }
    //         },

    //     ]
    // },
    // {
    //     path: '/container-management',
    //     icon: 'md-key',
    //     title: '应用实体管理',
    //     name: 'container-management',
    //     component: Main,
    //     meta: {
    //         access: ["2"],
    //     },
    //     children: [

    //         {
    //             path: 'createContainer', title: '创建应用实体', icon: 'md-key', name: 'create-container', component: () => import('@/views/container-mamagement/createContainer'),
    //             meta: {
    //                 access: ["2"],
    //             }
    //         },
    //         {
    //             path: 'containerList', title: '应用实体信息管理', icon: 'md-appstore', name: 'container-list', component: () => import('@/views/container-mamagement/containerList'),
    //             meta: {
    //                 access: ["2"],
    //             }
    //         },
    //     ]
    // },

    // 审计员部分菜单权限
    // {
    //     path: '/log-management',
    //     icon: 'md-chatboxes',
    //     title: '日志管理',
    //     name: 'log-management',
    //     component: Main,
    //     meta: {
    //         access: ["1"],
    //     },
    //     children: [

    //         {
    //             path: 'logConfigure', title: '日志配置', icon: 'md-albums', name: 'log-configure', component: () => import('@/views/log-management/logConfigure'),
    //             meta: {
    //                 access: ["1"],
    //             }
    //         },
    //         {
    //             path: 'logList', title: '日志查看', icon: 'md-eye', name: 'log-list', component: () => import('@/views/log-management/logList'),
    //             meta: {
    //                 access: ["1"],
    //             }
    //         },
    //         // {
    //         //     path: 'logArchiving', title: '日志归档', icon: 'md-log-out', name: 'log-archiving', component: () => import('@/views/log-management/logArchiving'),
    //         //     meta: {
    //         //         access: ["3"],
    //         //     }
    //         // }

    //     ]
    // },
];
// 所有上面定义的路由都要写在下面的routers里
export const routers = [

    loginRouter,
    otherRouter,
    ...appRouter,
    page500,
    page403,
    page404,

];
