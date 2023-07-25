import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { asyncRoutes, staticRoutes, anyRoutes } from '@/router/routes'
import router from '@/router'
import _ from "lodash"

// 从所有路由中过滤出返回的路由
function filterAllSyncRoutes(routes, userRoutes) {
  // 定义一个数组存过滤后的路由
  const newRoutes = []
  // 过滤路由
  // routes.filter(item => { userRoutes.includes(item.name) })
  routes.forEach((item) => {
    if (userRoutes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        filterAllSyncRoutes(item.children, userRoutes)
      }
      newRoutes.push(item)
    }
  })
  return newRoutes
}

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    buttons: [],
    roles: [],
    routes: [],
    menuRoutes: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_BUTTONS: (state, buttons) => {
    state.buttons = buttons;
  },
  SET_ROUTES: (state, routes) => {
    state.routes = routes;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  },
  SET_USER: (state, data) => {
    state = data;
  },
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { name, avatar,buttons,routes,roles } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit("SET_BUTTONS", buttons);
        commit("SET_ROUTES", routes);
        commit("SET_ROLES", roles);

        // 请求与赋值结束，接下来需要得到过滤后的路由
        // asyncRouter不能够直接作为参数使用，需要深拷贝，这里使用lodash库
        const userRouter = filterAllSyncRoutes(
          _.cloneDeep(asyncRoutes),
          routes
        );
        // console.log("userRouter", userRouter);

        // 每次不同的用户登录会有不同的路由菜单
        // 每次的路由菜单都是静态路由 + 过滤后的路由
        state.menuRoutes = [...staticRoutes, ...userRouter];
        // console.log(state.menuRoutes);

        // 当前注册到vue实例上的还是只包含静态路由的router
        // 所以我们需要将当前的路由菜单注册到router上
        // userRouter.forEach(userItem => router.addRoutes(userItem))
        router.addRoutes([...userRouter, ...anyRoutes]);

        commit("SET_USER", {
          token: getToken(),
          name: state.name,
          avatar: state.avatar,
          buttons: state.buttons,
          roles: state.roles,
          routes: state.routes,
          menuRoutes: [...staticRoutes, ...asyncRoutes],
        });

        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

