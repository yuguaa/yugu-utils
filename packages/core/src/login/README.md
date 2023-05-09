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

