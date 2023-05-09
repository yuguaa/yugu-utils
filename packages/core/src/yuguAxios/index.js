import axios from 'axios'

class YuguAxios {
  static axiosInstance = null
  constructor(options) {
    this.createAxios(options)
  }

  createAxios(options) {
    this.axiosInstance = axios.create(options)
    this.options = options
    this.setupInterceptors()
  }

  setupInterceptors() {
    const { interceptors } = this.options
    if (!interceptors) return
    const { requestInterceptors, requestInterceptorsCatch, responseInterceptors, responseInterceptorsCatch } =
      interceptors

    this.axiosInstance.interceptors.request.use(config => {
      config = requestInterceptors(config, this.options)
      return config
    })

    if (requestInterceptorsCatch) {
      this.axiosInstance.interceptors.request.use(undefined, requestInterceptorsCatch)
    }

    this.axiosInstance.interceptors.response.use(response => {
      response = responseInterceptors(response)
      return response
    })

    if (responseInterceptorsCatch) {
      this.axiosInstance.interceptors.response.use(undefined, error => responseInterceptorsCatch(error))
    }
  }

  get(config, options) {
    return this.request({ ...config, method: 'GET' }, options)
  }

  post(config, options) {
    return this.request({ ...config, method: 'POST' }, options)
  }

  put(config, options) {
    return this.request({ ...config, method: 'PUT' }, options)
  }

  delete(config, options) {
    return this.request({ ...config, method: 'DELETE' }, options)
  }

  request(config, options) {
    let conf = config
    const { requestOptions } = this.options
    const opt = Object.assign({}, requestOptions, options)
    conf.requestOptions = opt
    conf.headers = {
      'Content-Type': 'application/json;charset=UTF-8',
      ...conf.headers,
      ...opt.headers
    }
    return new Promise((resolve, reject) => {
      this.axiosInstance
        .request(conf)
        .then(res => {
          resolve(res)
        })
        .catch(e => {
          reject(e)
        })
    })
  }
}
export default YuguAxios
