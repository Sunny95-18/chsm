import {otherRouter,appRouter} from '@/router/router.js'
const app = {
    state: {
        cachePage: [],
        lang: '',
        isFullScreen: false,
        openedSubmenuArr: ["xxx"], 
		openNames : [],    // 要展开的菜单数组
        menuTheme: 'dark', // 主题
        themeColor: '',
        pageOpenedList: [
            {
            title: '首页',
            path: '',
            name: 'home_index'
        }
    ],
        currentPageName: '',
        currentPath: [], // 面包屑数组
        // 菜单权限标识
        access: 0,
        menuList: [],
		pathMapping : {},
        routers: [
            otherRouter,
            ...appRouter,
        ],
        tagsList: [],
        vmTagsList:[],
        messageCount: 0,
        dontCache: ['timer-manage-key-update', 'timer-manage-key-buffer','timer-manage-key-state','timer-manage-key-pretreatment'] // 在这里定义你不想要缓存的页面的name属性值(参见路由配置router.js)
    },
    getters: {
        // 根据不同的权限加载不同的菜单
        menus: (state, getters, rootState) => {
            var accessCode = parseInt(Cookies.get('access'));
            // let accessCode=state.access;
            if(accessCode!=-1){
             var menus=state.menuList.filter(router=>{
                   if(!router.meta|| router.meta.access==accessCode){
                       return true;
                   }
                   return false;
             });
             return menus;
            }else{
                return state.menuList;
            }
            
          
            // return state.menuList;
            /*
            var access = state.access + "";
            // 超管所有权限
            if(access == 0) return state.menuList;
            var menus = state.menuList.filter(route => {;
                if(!route.meta || !route.meta.access) {
                    return true;
                }
                var menuAccess = route.meta.access;
                if(typeof(menuAccess) == "string" && menuAccess == access) {
                    return true;
                } else if(Array.isArray(menuAccess) && menuAccess.indexOf(access) > -1) {
                    return true;
                }
                return false;
            });
            if(menus && menus.length == 0) {
                console.log(" menus empty !");
            }
            return menus;*/
        },
    },
    mutations: {
		appInit (state) {
           /* const access = Cookies.get('access');
            if(access !== -1) {
                state.access = access;
            }*/

            let routers = state.routers;
			let pathMapping = state.pathMapping;
			let tagsList = state.tagsList;
         
             // 解析每个路由
            // 1 以name为key设置pathMapping的映射
            // 2 给每个叶子（对象没有children属性）路由创建currentPathArr集合（导航面包屑）
            // 3 将每个叶子（对象没有children属性）路由添加到tagsList
            var parseRouter = (item,currentPathArr) => {
                let name = item.name;
                // console.log("routerName:"+name);
			    pathMapping[name] = item;
                if(!currentPathArr) {
                     currentPathArr = [
                             {
                                 title: '首页',
                                 path: '/home',
                                 name: 'home_index'
                             }
                            ];
                 }
                 // 如果包含children，则当前item为目录

                if(item.name != "home_index" && item.title) {
                    currentPathArr.push({
                        title: item.title,
                        name: item.name
                    });
                } 

                if(item.children) {
					tagsList.push(...item.children);
                    item.children.forEach(child => {
                        parseRouter(child,[...currentPathArr]);
                    });
				} else {
                    item.pathTextArr = currentPathArr;
                }

            }

            routers.forEach(item => {
                parseRouter(item,[
                    {
                        title: '首页',
                        path: '/home',
                        name: 'home_index'
                    }
                ]);
            });
            
        },

        // 设置菜单权限信息
        setAccess(state, access) {
            state.access = access
        },
        setTagsList (state, list) {
            state.tagsList.push(...list);
        },
        updateMenulist (state) {
            let accessCode = parseInt(Cookies.get('access'));
            // console.log("accessCode:"+accessCode);
            let menuList = [];
            appRouter.forEach((item, index) => {
                // console.log("路由："+item.meta.access);
                if (item.access !== undefined) {
                    if (Util.showThisRoute(item.access, accessCode)) {
                        if (item.children.length === 1) {
                            menuList.push(item);
                        } else {
                            let len = menuList.push(item);
                            let childrenArr = [];
                            childrenArr = item.children.filter(child => {
                                if (child.access !== undefined) {
                                    if (child.access === accessCode) {
                                        return child;
                                    }
                                } else {
                                    return child;
                                }
                            });
                            menuList[len - 1].children = childrenArr;
                        }
                    }
                } else {
                    if (item.children.length === 1) {
                        menuList.push(item);
                    } else {
                        let len = menuList.push(item);
                        let childrenArr = [];
                        childrenArr = item.children.filter(child => {
                            if (child.access !== undefined) {
                                if (Util.showThisRoute(child.access, accessCode)) {
                                    return child;
                                }
                            } else {
                                return child;
                            }
                        });
                        if (childrenArr === undefined || childrenArr.length === 0) {
                            menuList.splice(len - 1, 1);
                        } else {
                            let handledItem = JSON.parse(JSON.stringify(menuList[len - 1]));
                            handledItem.children = childrenArr;
                            menuList.splice(len - 1, 1, handledItem);
                        }
                    }
                }
            });
            state.menuList = menuList;
    
        },
        changeMenuTheme (state, theme) {
            state.menuTheme = theme;
        },
        changeMainTheme (state, mainTheme) {
            state.themeColor = mainTheme;
        },
        setOpenName(state, name) {
			let currentItem = state.pathMapping[name];
            if(currentItem) {
                let openNames = state.openNames;
				let paths = currentItem.pathTextArr;
                if(paths.length > 1) {
                    // 如果menu使用accordion需要清除，否则注释掉下面一行代码
                   openNames.splice(0,openNames.length);
                   for(let i = 1; i < paths.length - 1; i++) {
                       let openName = paths[i].name;
                       if(openName && openNames.indexOf(openName) == -1) {
                            openNames.push(openName);
                       }
                   }
				}
			} 
		},
        addOpenSubmenu (state, name) {
            let hasThisName = false;
            let isEmpty = false;
            if (name.length === 0) {
                isEmpty = true;
            }
            if (state.openedSubmenuArr.indexOf(name) > -1) {
                hasThisName = true;
            }
            if (!hasThisName && !isEmpty) {
                state.openedSubmenuArr.push(name);
            }
        },
        closePage (state, name) {
            state.cachePage.forEach((item, index) => {
                if (item === name) {
                    state.cachePage.splice(index, 1);
                }
            });
        },
        initCachepage (state) {
            if (localStorage.cachePage) {
                state.cachePage = JSON.parse(localStorage.cachePage);
            }
        },
        removeTag (state, name) {
            state.pageOpenedList.map((item, index) => {
                if (item.name === name) {
                    state.pageOpenedList.splice(index, 1);
                }
            });
        },
        resetPageOpenedList(state){
            state.pageOpenedList.splice(1)
        },
        pageOpenedList (state, get) {
            let openedPage = state.pageOpenedList[get.index];
            if (get.argu) {
                openedPage.argu = get.argu;
            }
            if (get.query) {
                openedPage.query = get.query;
            }
            state.pageOpenedList.splice(get.index, 1, openedPage);
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        },
        clearAllTags (state) {
            state.pageOpenedList.splice(1);
            state.cachePage.length = 0;
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        },
        clearOtherTags (state, vm) {
            let currentName = vm.$route.name;
            let currentIndex = 0;
            state.pageOpenedList.forEach((item, index) => {
                if (item.name === currentName) {
                    currentIndex = index;
                }
            });
            if (currentIndex === 0) {
                state.pageOpenedList.splice(1);
            } else {
                state.pageOpenedList.splice(currentIndex + 1);
                state.pageOpenedList.splice(1, currentIndex - 1);
            }
            let newCachepage = state.cachePage.filter(item => {
                return item === currentName;
            });
            state.cachePage = newCachepage;
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        },
        setOpenedList (state) {
            state.pageOpenedList = localStorage.pageOpenedList ? JSON.parse(localStorage.pageOpenedList) : [otherRouter.children[0]];

        },
        setCurrentPath (state, toName) {
            let currentItem = state.pathMapping[toName];
            if(currentItem) {
				state.currentPath = currentItem.pathTextArr;
			} 
        },
        openNewTab (state,name) {
			 let hasTag = state.pageOpenedList.some(item => {
                 if (item.name === name) {
                     return true;
                 }
             });
             if (!hasTag) { 
                 // 创建新的tab
                 // 根据name查找tagList的item然后push到pageOpenedList
                 let toTags = state.tagsList.filter((item) => {
						if (item.children) {
							return name === item.children[0].name;
						} else {
							return name === item.name;
						}
					});
				 let toTag = toTags[0];
                 toTag = toTag.children ? toTag.children[0] : toTag;
                 state.pageOpenedList.push(toTag);
				 localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);

                 if(state.cachePage.indexOf(name) == -1) {
					state.cachePage.push(name);
				 }
				 localStorage.cachePage = JSON.stringify(state.cachePage);
             }
		},
        setCurrentPageName (state, name) {
            state.currentPageName = name;
        },
        setAvator (state, path) {
            localStorage.avatorImgPath = path;
        },
        switchLang (state, lang) {
            state.lang = lang;
            Vue.config.lang = lang;
        },
        clearOpenedSubmenu (state) {
            state.openedSubmenuArr.length = 0;
        },
        setMessageCount (state, count) {
            state.messageCount = count;
        },
        increateTag (state, tagObj) {
            if (!Util.oneOf(tagObj.name, state.dontCache)) {
                state.cachePage.push(tagObj.name);
                localStorage.cachePage = JSON.stringify(state.cachePage);
            }
            state.pageOpenedList.push(tagObj);
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        }
    }
};

export default app;
