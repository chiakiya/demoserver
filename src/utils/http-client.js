// Lib imports
import axios from 'axios'
import logger from '../plugins/app-logger'

// create an axios instance
const httpClient = axios.create({
  baseURL: process.env.VUE_APP_SERVER_URL, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
httpClient.interceptors.request.use(
  config => {
    return config
  },
  error => {
    // do something with request error
    logger.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
httpClient.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    return res;

  },
  error => {
    logger.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

export { httpClient };
