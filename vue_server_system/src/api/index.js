import axios from 'axios'
import Element from 'element-ui'
import router from '@/router'

axios.defaults.baseURL = '/api'
//创建一个axios的请求对象
const myaxios = axios.create({
  timeout: 5000, //设置超时的时间
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
})

//基础路径的设置：访问Java服务器  加: http://localhost:8080
//myaxios.default.baseURL = 'http://localhost:8989/api'

//设置axios的拦截器（发起请求之前）。 请求之前做一些设置: 将token携带 请求头中。
myaxios.interceptors.request.use(config => {
  config.headers['token'] = localStorage.getItem('token')
  return config
})

//设置axios拦截器（响应数据处理之前 , then()执行之前）  状态码判断，20000正常执行， 其它错误验证码 （直接处理）
myaxios.interceptors.response.use(
  response => {
    //获得服务器返回的数据
    let result = response.data
    //Java服务器自定义 请求状态码：20000成功,10001用户名不存在,10002 密码错误
    if (result.code == 20000) {
      return response
    } else {
      Element.Message.warning(result.message ? result.message : '系统异常')
      return Promise.reject(response.data.message)
    }
  },
  error => {
    //error.repsonse.data.status  状态码不是我们Java服务器自定义状态码，是程序执行错误，http协议的错误码
    if (error.response.data) {
      error.message = error.response.data.message
    }
    if (error.response.status == 401) {
      router.push('/login')
      return Promise.reject(error) //Promise.resolve标识异步请求执行完毕了。
    }
    if (error.response.status == 404) {
      //如果程序执行返回的状态码是404，那么就跳转至notfound界面
      router.push('/notfound')
      return Promise.reject(error)
    }
    if (error.response.status == 400) {
      error.message = '请求服务器的方法错误'
    }
    if (error.response.status == 500) {
      error.message = '服务器代码错误'
    }
    Element.Message.error(error.message)
    return Promise.reject(error) //标识异步请求执行完毕了。
  }
)

export default myaxios
