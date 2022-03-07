import request from '@/router/axios'

export const getList = (current, size, params) => {
  return request({
    url: '/tw-recruit-api/blade-system/client/list',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

export const getDetail = id => {
  return request({
    url: '/tw-recruit-api/ecruit-api/blade-system/client/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = ids => {
  return request({
    url: '/tw-recruit-api/blade-system/client/remove',
    method: 'post',
    params: {
      ids
    }
  })
}

export const add = row => {
  return request({
    url: '/tw-recruit-api/blade-system/client/submit',
    method: 'post',
    data: row
  })
}

export const update = row => {
  return request({
    url: '/tw-recruit-api/blade-system/client/submit',
    method: 'post',
    data: row
  })
}
