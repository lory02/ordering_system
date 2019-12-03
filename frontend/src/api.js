import axios from 'axios'

// 自定义axios,设置baseURL
let api = axios.create({
  baseURL: 'http://localhost:5000/api/',
  withCredentials: true
})

export default api;