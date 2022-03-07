import request from '@/router/axios'

export const getList = (current, size, params) => {
  return request({
    url: '/tw-recruit-api/blade-resource/attach/list',
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
    url: '/tw-recruit-api/blade-resource/attach/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = ids => {
  return request({
    url: '/tw-recruit-api/blade-resource/attach/remove',
    method: 'post',
    params: {
      ids
    }
  })
}

export const add = row => {
  return request({
    url: '/tw-recruit-api/blade-resource/attach/submit',
    method: 'post',
    data: row
  })
}

export const update = row => {
  return request({
    url: '/tw-recruit-api/blade-resource/attach/submit',
    method: 'post',
    data: row
  })
}
