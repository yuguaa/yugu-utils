/**
 * @class Login
 * @description
 * This class is used to login to the application.
 * @params
 * account - The account number to login with.
 * password - The password to login with.
 * corpCode - The corp code to login with.
 * stage - The stage to login to.
 * mode - The mode of process.
 * @example
 * const login = new Login(config)
 * login.login()
 */

import axios from 'axios'
import Cookies from 'js-cookie'
class Login {
  // static loginUrl = 'http://21tb-vuelibrary.21tb.com/tbc-nest'
  constructor({ loginErrorCapture, elnSessionId, mode, ...loginOptions }) {
    this.elnSessionId = elnSessionId || 'eln_session_id'
    this.mode = mode || 'production'
    this.loginErrorCapture = loginErrorCapture
    this.loginOptions = loginOptions
  }
  // getProcessEnvMode() {
  //   console.log('process.env.NODE_ENV', process.env.NODE_ENV)
  //   // console.log('import.meta.env.MODE', import.meta.env.MODE)
  //   return process.env.NODE_ENV || 'production'
  // }
  isDevMode() {
    return this.mode === 'development'
  }
  login() {
    return new Promise((resolve, reject) => {
      const loginConfig = {
        url: '',
        data: {},
        config: {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }
      }
      if (this.isDevMode()) {
        loginConfig.url = '/tbc-nest/login'
        loginConfig.data = this.loginOptions
      } else {
        loginConfig.url = '/login/login.loginV4.do'
      }
      // 这里使用axios请求登录接口
      axios
        .post(loginConfig.url, loginConfig.data, loginConfig.config)
        .then(res => {
          if (res.status === 200 && res.data.code == 1001) {
            if (this.isDevMode()) {
              Cookies.set('corp_code', res.data.bizResult.corpCode)
              Cookies.set('corpCode', res.data.bizResult.corpCode)
              Cookies.set(this.elnSessionId, res.data.bizResult.sessionId, 'Session')
            }
            resolve(res.data)
          } else {
            ;(this.loginErrorCapture && this.loginErrorCapture(res)) || this.logout()
            reject(res.data)
          }
        })
        .catch(err => {
          console.log(`🚀 ~ TbcLogin ~ returnnewPromise ~ err:`, err)
          ;(this.loginErrorCapture && this.loginErrorCapture(err)) || this.logout()
          reject(err)
        })
    })
  }
  logout() {
    Cookies.remove(this.elnSessionId)
    const href = window.location.href
    const returnUrl = encodeURIComponent(href)
    const origin = window.origin.includes('localhost') ? 'http://cloud.21tb.com' : window.origin
    const loginUrl = origin + '/login/login.init.do' + '?returnUrl=' + returnUrl
    window.location.replace(loginUrl)
  }
}

export default Login
