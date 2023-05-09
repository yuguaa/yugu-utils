### YuguAxios请求工具类
二次封装了axios，用于创建一个axios实例。在这个类中还定义了一些方法，如get、post、put、delete等，用于发送HTTP请求，并返回一个Promise对象，用于异步处理结果。这些方法都接收两个参数：config和options。其中，config参数用于设置请求的参数，如URL、请求体、请求头等；options参数用于设置一些其他的请求参数，如请求超时、请求重试、请求拦截器、响应拦截器等。这个类还定义了setupInterceptors()方法，用于设置请求和响应的拦截器。这些拦截器可以对请求和响应进行处理，如添加请求头、处理请求参数、处理响应结果等。最后，这个类还定义了一个request()方法，用于发送请求，并返回一个Promise对象，用于异步处理结果。在这个方法中，它使用了axiosInstance的request()方法来发送请求，并且在请求头中添加了Content-Type，以指定请求的数据类型为JSON。

####  usage
```javaScript
import { YuguAxios } from '@yugu/utils'

const interceptors = {
  requestInterceptors: (config, options) => {
    config.headers = {
      ...config.headers,
      ...options.headers,
    }
    return config
  },
  requestInterceptorsCatch: (error) => {
    console.log(`🚀 ~ error:`, error)
    return Promise.reject(error)
  },
  responseInterceptors: (response) => {
    console.log(`🚀🚀🚀🚀🚀🚀 ~ interceptors.response:`, response)
    const res = response.data
    //兼容/live/amis/格式并不是常用格式
    const whiteList = ['/live/amis/courseware/getSubtitleInfo', '/live/amis/courseware/updateSubtitleInfo']

    let matchUrl = response.config.url
    if (response.status === 200 && whiteList.indexOf(matchUrl) !== -1) {
      return res
    }

    // 错误响应 response.data instanceof Blob是为了兼容下载接口 加res.success判断是为了兼容其他服务不带code的情况下 uc的接口返回的没有code也没有success字段
    if (
      res &&
      !(res instanceof Blob) &&
      (res.status === 'ERROR' ||
        (res.code !== 0 &&
          res.code !== 1001 &&
          !res.success &&
          response.config.url.indexOf('/uc/') === -1 &&
          response.statusText !== 'OK'))
    ) {
      message.error({
        content: res.message || 'Error',
        duration: 5 * 1000,
      })
      return res
    } else {
      return res
    }
  },
  responseInterceptorsCatch: (error) => {
    console.log(`🚀 ~ error:`, error)
    if (error && error.response && (error.response.status === 403 || error.response.status === 503)) {
      goToLogin()
    } else {
      message.error({
        content: error.message || 'Error',
        duration: 5 * 1000,
      })
    }
    return Promise.reject(error)
  },
}

export const createAxios = (options) => {
  return new YuguAxios(
    Object.assign(
      {},
      {
        interceptors,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        ...options,
      },
    ),
  )
}
export const yAxios = createAxios()
```

#### apis
```javaScript
import request from '@/utils/request'

export function getUserInfo() {
  return request({
    url: '/biz-oim/user/get.do',
    method: 'get'
  })
}
```
