import request from '@/utils/request'

// 注册
export const userRegisterService = ({ username, password, repassword }) =>
  request.post('/api/reg', { username, password, repassword })

// 登录
export const userLoginService = ({ username, password }) =>
  request.post('/api/login', { username, password })

// 用户 -获取用户基础信息
export const userInfoService = () => request.get('/my/userinfo')

// 更新 -用户基本资料
export const userUserinfoService = ({ id, nickname, email }) =>
  request.put('/my/userinfo', { id, nickname, email })

// 更新 -用户头像
export const userUpdateAvatarService = (avatar) =>
  request.patch('/my/update/avatar', { avatar })

// 更新 -用户密码
export const userUpdatePwdService = ({ old_pwd, new_pwd, re_pwd }) =>
  request.patch('/my/updatepwd', { old_pwd, new_pwd, re_pwd })
