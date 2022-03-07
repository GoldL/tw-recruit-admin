import request from '@/router/axios'
import { getToken } from '@/util/auth'
import { Message } from 'element-ui'

export const post = (url, params, isJSON = true) => {
  return baseRequest('post', url, params, isJSON)
}

export const get = (url, params) => {
  return baseRequest('get', url, params, false)
}

const baseRequest = (method, url, params, isJSON = true) => {
  return new Promise((resolve, reject) => {
    const requestObj = { url, method }
    // post请求的序列化需要用data做key
    const key = isJSON ? 'data' : 'params'
    requestObj[key] = params
    request(requestObj)
      .then(res => {
        resolve({
          msg: res.data.msg,
          data: res.data.data,
          code: res.data.code
        })
      })
      .catch(err => {
        reject(err)
      })
  })
}

// 下载后端返回的文件流
export const downloadFile = (url, params, type, fileName, isJSON) => {
  const axios = window.axios.create()
  const config = {
    method: 'post',
    url,
    responseType: 'blob',
    headers: {
      'Blade-Auth': 'bearer ' + getToken()
    }
  }
  if (isJSON === false) {
    // 不为application/json
    config.params = params
  } else {
    config.data = params
  }
  return axios(config).then(res => {
    if (res.status !== 200) {
      const reader = new FileReader()
      reader.readAsText(res.data, 'utf-8')
      reader.onload = function(e) {
        const result = JSON.parse(reader.result)
        const message = result.msg || '导出失败，请稍后重试'
        Message({ type: 'error', message, duration: 3000 })
      }
      return
    }
    if ('msSaveOrOpenBlob' in navigator) {
      // 兼容ie
      window.navigator.msSaveOrOpenBlob(res.data, fileName)
      return
    }
    const blob = new Blob([res.data], { type })
    const url = window.URL.createObjectURL(blob) // 创建下载链接
    const a = document.createElement('a')
    a.download = fileName
    a.href = url
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url) // 释放掉blob对象
  })
}

/**
 * 下载二进制流txt
 * @param {*} blobString 二进制流
 * @param {*} filename 文件名
 */
export const downTxt = (blobString, filename) => {
  // 创建隐藏的可下载链接
  var eleLink = document.createElement('a')
  eleLink.download = filename
  eleLink.style.display = 'none'
  // 字符内容转变成blob地址
  var blob = new Blob(blobString)
  eleLink.href = URL.createObjectURL(blob)
  // 触发点击
  document.body.appendChild(eleLink)
  eleLink.click()
  // 然后移除
  document.body.removeChild(eleLink)
}

const zeroTime = new Date(new Date().toLocaleDateString())
const twentyThreeTime = new Date()
twentyThreeTime.setTime(zeroTime.getTime() + 3600 * 1000 * 24 * 1 - 1)

export const pickerOptions = {
  shortcuts: [
    {
      text: '今天',
      onClick(picker) {
        picker.$emit('pick', [zeroTime, twentyThreeTime])
      }
    },
    {
      text: '最近一周',
      onClick(picker) {
        const start = new Date()
        start.setTime(zeroTime.getTime() - 3600 * 1000 * 24 * 7)
        picker.$emit('pick', [start, twentyThreeTime])
      }
    },
    {
      text: '最近一个月',
      onClick(picker) {
        const start = new Date()
        start.setTime(zeroTime.getTime() - 3600 * 1000 * 24 * 30)
        picker.$emit('pick', [start, twentyThreeTime])
      }
    },
    {
      text: '最近三个月',
      onClick(picker) {
        const start = new Date()
        start.setTime(zeroTime.getTime() - 3600 * 1000 * 24 * 90)
        picker.$emit('pick', [start, twentyThreeTime])
      }
    }
  ]
}
