import { appRouter, routers } from '../../router/router'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.indexOf(role) >= 0)
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param appRouter
 * @param roles
 */
function filterAsyncRouter(appRouter, roles) {
  const accessedRouters = appRouter.filter(route => {
    if (hasPermission(roles, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

const permission = {
  state: {
    routers: routers,
    addRouters: []
  },
  mutations: {
    setRoles: (state, routers) => {
      state.addRouters = routers
      state.routers = routers.concat(routers)
      console.log('state.routers', state.routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { roles } = data
        let accessedRouters
        if (roles.indexOf('admin') >= 0) {
          console.log('admin>=0')
          accessedRouters = appRouter
        } else {
          console.log('admin<0')
          accessedRouters = filterAsyncRouter(appRouter, roles)
        }
        console.log('accessedRouters', accessedRouters)
        commit('setRoles', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
