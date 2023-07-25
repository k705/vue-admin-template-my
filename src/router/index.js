import Vue from 'vue'
import Router from 'vue-router'
import { staticRoutes } from './routes'
Vue.use(Router)
// 重写push和replace
const oldPush = Router.prototype.push;
const oldReplace = Router.prototype.replace;

Router.prototype.push = function (
  location,
  onComplete = () => { },
  onAbort = () => { }
) {
  oldPush.call(this, location, onComplete, onAbort);
};
Router.prototype.replace = function (
  location,
  onComplete = () => { },
  onAbort = () => { }
) {
  oldReplace.call(this, location, onComplete, onAbort);
};



// 注册路由
const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: staticRoutes
})
const router = createRouter()


// 退出登录清空路由
// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
