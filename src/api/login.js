import request from '@/utils/request'

// 登录方法
export function login(tenantId, username, password, code, uuid) {
  const data = {
    tenantId,
    username,
    password,
    code,
    uuid
  }
  return request({
    url: '/auth/login',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 注册方法
export function register(data) {
  return request({
    url: '/auth/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/system/user/getInfo',
    method: 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/sms/code',
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
  })
}

// 获取租户列表
export function getTenantList() {
  return request({
    url: '/auth/tenant/list',
    headers: {
      isToken: false
    },
    method: 'get'
  })
}
