# Vue2 后台管理

> 尚品汇后台管理 Vue2 版本

- 必做

  - 搭建基础环境 (登陆 / 商品管理的路由)
  - 品牌管理
  - 用户管理
  - 权限控制

- 选做其中至少一个
  - 角色管理 / 菜单管理
  - 平台属性管理
  - SPU/SKU 管理
  - 分类管理

## 配置

### vue.config.js

```js
// before: require('./mock/mock-server.js'),
proxy: {
'/dev-api': { // 匹配所有以 '/dev-api'开头的请求路径
target: 'http://gmall-h5-api.atguigu.cn', //后台接口地址
changeOrigin: true, // 支持跨域
pathRewrite: { // 重写路径: 去掉路径中开头的'/dev-api'
'^/dev-api': ''
}
},
}
```
