import { LoadingBar, Message } from 'view-design'
import Router from 'vue-router'
import { routers } from '@/router/router.js'
import { getToken } from '@/utils/token'
Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new Router({
  // mode: "history",
  mode: "hash",
  base: process.env.BASE_URL,
  routes: routers,
})

export default router;



// 权限管理
router.beforeEach((to, from, next) => {
  // console.log("name:"+to.name);
  // console.log("to:"+to.meta.access);
  LoadingBar.start();
 

  const token = getToken();
 if (!token && to.name !== "login") {
    // 未登录且要跳转的页面不是登录页
    // 如果有页面不需要登陆也可以访问的可以修改判断条件
    next({
      name: "login" // 跳转到登录页
    });
  
  } else if (!token && to.name === "login") {
    // 未登陆且要跳转的页面是登录页
    next();
  } else {

    // 如果已经登陆判断是否有权限访问
    let access = Cookies.get("access");
    if (access == 2) {
      next();
    } else if (to.matched && to.matched.length > 0) {
      let root = to.matched[0];
      if (!root.meta || !root.meta.access) {
        next();
      } else {
        var pathAccess = root.meta.access;
        if (typeof (pathAccess) == "string" && pathAccess == access) {
          next();
        } else if (Array.isArray(pathAccess) && pathAccess.indexOf(access) > -1) {
          next();
        } else {
          next({
            name: "error-403"
          });
        }
      }
    }



  }

  // next()
});

router.afterEach((to) => {
  LoadingBar.finish();
  window.scrollTo(0, 0);
});



//permission judge function
// function hasPermission(roles, permissionRoles) {
//   if (roles.indexOf('admin') >= 0) return true // admin permission passed directly
//   if (!permissionRoles) return true
//   return roles.some(role => permissionRoles.indexOf(role) >= 0)
// }

// router.beforeEach((to, from, next) => {
//   LoadingBar.start();
//   // console.log("router:", router.options.routes)
//   const token = getToken();
//   // console.log("token:", token)
//   // console.log("to:", to.name)
//   // console.log(!token )
//   // if (to.name == null) {
//   //   next({
//   //     name: "login" // 跳转到登录页
//   //   })
//   // }
//   // if (!token && to.name !== "login") {
//   //   next({
//   //     name: "login" // 跳转到登录页
//   //   })
//   // } else if (!token && to.name === "login") {
//   //   // 未登陆且要跳转的页面是登录页
//   //   next()

//  if(token){
//   } else {
//     /* has token*/
//     console.log("get:",store.getters.routes)
//     if (store.getters.roles.length === 0) {
//       // store.dispatch('getUserInfo').then(res => { // 拉取用户信息
//         // const roles = res.roles //
//         const roles=['admin']
//         store.dispatch('GenerateRoutes', { roles }).then(() => { // 根据roles权限生成可访问的路由表
//           router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
//           next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 
//         // })
//       }).catch((err) => {
//         console.log("err:", err);
//       })
//     } else {
//       // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
//       if (hasPermission(store.getters.roles, to.meta.roles)) {
//         next()//
//       } else {
//         next({ path: '/401', replace: true, query: { noGoBack: true } })
//       }
//     }
//   }

// })

// router.afterEach(() => {
//   LoadingBar.finish();
//   window.scrollTo(0, 0);
// })