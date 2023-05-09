# yugu-utils
> 工具插件，提升开发效率使用,包含多个工具包。
## 安装

```
npm install @yugu/utils
```
### Login工具类
依赖后台node登录服务tbc-nest项目，支持开发和生产环境使用。
用于开发环境登录的mock，解决前后端分离项目中登录cookie的问题。
配置简单。
> 调用登录会返回用户的登录信息，和平台登录返回值一直，以便后续执行国际化等操作的设置。注意：该工具类只是登录使用，接口登录失败仍需自己处理。

####  usage
```
import { Login } from '@yugu/utils'

const tbcLogin = new Login({
  corpCode: 'xxx',
  account: 'xxx',
  password: 'xxxxxx',
  stage: 'http://xxx.21tb.com',
  mode: process.env.NODE_ENV,
})

tbcLogin.login()
```
#### 项目配置
项目需要配置代理转发，解决登录跨域问题。后台代理地址 `http://21tb-vuelibrary.21tb.com/tbc-nest`
```javascript
  // react
app.use(
    createProxyMiddleware('/tbc-nest', {
      target: 'http://21tb-vuelibrary.21tb.com/tbc-nest',
      changeOrigin: true,
    }),
  )

```
#### 配置

以下为示例 api 形式 ， 以供参考

| 属性 | 说明  | 类型  | 默认值  |
| --- | ---- | ----- | ----- |
| corpCode | 公司code | string  |  /  |
| account | 账号 | string  |  /  |
| password | 密码 | string  |  /  |
| stage | 登录环境 | string  |  /  |
| mode | 环境模式 | string  |  production  |
| elnSessionId | eln_sesstion_id | string  |  eln_session_id  |
| loginErrorCapture | 登录失败操作 | fn  |  logout(清除cookie，跳转登录)  |

#### 方法

以下为示例 api 形式 ， 以供参考

| 属性 | 说明  | 类型| 返回值|
| --- | ---- | ---- | ---- |
| login | 调用登录方法| Promise |该方法会调用登录方式及，开发模式下自动设置 cookie， 返回通用登录信息|


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

