# Vue3-big-event-admin

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Compile and Minify for Production

```sh
pnpm build
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```

### 预览地址
  https://king-dot1.github.io/event-tracker/#/login
### 作品概括:
一个后台数据管理系统，具备登录注册、首页布局、文章分类管理、文章管理、个人中心等功能。用户可登录注册进入系统，进行文章分类的增删改、文章的发布编辑删除及搜索，还能在个人中心修改信息、更换头像和重置密码。
### 应用技术：
1)前端框架与库：Vue3 构建项目基础架构，Element Plus 提供丰富组件加速页面开发;
2)数据管理：Pinia 管理应用数据，确保数据一致性与响应式更新;
3)路由管理：Vue Router4 实现灵活的路由配置与页面导航;
4)数据请求：Axios 进行数据请求，二次封装并设置拦截器处理身份验证和错误;
5)构建工具：Vite 用于项目的快速开发和高效构建;
6)代码规范与管理：ESLint 和 prettier 规范代码风格，husky 在代码提交时进行检查;
