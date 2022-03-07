import request from '@/router/axios'
import website from '@/config/website'

export const loginByUsername = (tenantId, deptId, roleId, username, password, type, key, code) =>
  request({
    url: '/tw-recruit-api/blade-auth/oauth/token',
    method: 'post',
    headers: {
      'Tenant-Id': tenantId,
      'Dept-Id': website.switchMode ? deptId : '',
      'Role-Id': website.switchMode ? roleId : '',
      'Captcha-Key': key,
      'Captcha-Code': code
    },
    params: {
      tenantId,
      username,
      password,
      grant_type: website.captchaMode ? 'captcha' : 'password',
      scope: 'all',
      type
    }
  })

export const loginBySocial = (tenantId, source, code, state) =>
  request({
    url: '/tw-recruit-api/blade-auth/oauth/token',
    method: 'post',
    headers: {
      'Tenant-Id': tenantId
    },
    params: {
      tenantId,
      source,
      code,
      state,
      grant_type: 'social',
      scope: 'all'
    }
  })

export const refreshToken = (refreshToken, tenantId, deptId, roleId) =>
  request({
    url: '/tw-recruit-api/blade-auth/oauth/token',
    method: 'post',
    headers: {
      'Tenant-Id': tenantId,
      'Dept-Id': website.switchMode ? deptId : '',
      'Role-Id': website.switchMode ? roleId : ''
    },
    params: {
      tenantId,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
      scope: 'all'
    }
  })

export const registerGuest = (form, oauthId) =>
  request({
    url: '/tw-recruit-api/blade-user/register-guest',
    method: 'post',
    params: {
      tenantId: form.tenantId,
      name: form.name,
      account: form.account,
      password: form.password,
      oauthId
    }
  })

export const getButtons = () =>
  request({
    url: '/tw-recruit-api/blade-system/menu/buttons',
    method: 'get'
  })

export const getCaptcha = () =>
  request({
    url: '/tw-recruit-api/blade-auth/oauth/captcha',
    method: 'get'
  })

export const logout = () =>
  request({
    url: '/tw-recruit-api/blade-auth/oauth/logout',
    method: 'get'
  })

export const getUserInfo = () =>
  request({
    url: '/tw-recruit-api/blade-auth/oauth/user-info',
    method: 'get'
  })

export const sendLogs = list =>
  request({
    url: '/tw-recruit-api/blade-auth/oauth/logout',
    method: 'post',
    data: list
  })

export const clearCache = () =>
  request({
    url: '/tw-recruit-api/blade-auth/oauth/clear-cache',
    method: 'get'
  })
