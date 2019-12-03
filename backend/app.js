const express = require('express')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const io = require('socket.io')
const server = require('http').createServer(app)

const ioServer = io(server) // socket基于http的握手协议
global.ioServer = ioServer  
const port = 5000

//引入routes
const foods = require('./routes/foods')
const desks = require('./routes/desks')
const orders = require('./routes/orders')
const userAccount = require('./routes/userAccount')

//跨域设置
app.use(cors({
    origin: true,      //根据请求的url，设置对应的origin
    maxAge: 86400,     //有效时间     
    credentials: true  //携带cookie
}))


app.use(cookieParser('secret'))  //解析cookie
//基于body-parser，用于解析不同类型请求体
//使用这个模块可以解析JSON、Raw、文本、URL-encoded格式的请求体
app.use(express.urlencoded({extended: true})) 
app.use(express.json())  //解析json数据

/**
 * 静态资源，相对于静态目录查找文件
 * @param {string} 虚拟路径前缀，比如http://localhost:3000/static/hello.html
 * @param 注册express.static中间件(path)
 */
app.use('/static', express.static(__dirname + '/public/'))
app.use('/uploads',express.static(__dirname + '/uploads/'))

//routes注册为中间件
app.use('/api', foods)
app.use('/api', desks)
app.use('/api', orders)
app.use('/api', userAccount)

//监听端口
server.listen(port, () => {
    console.log('server listening on port', port)
})