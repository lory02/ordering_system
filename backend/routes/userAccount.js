const express = require('express')
const app = express.Router()
const dbPromise = require('../db')

let db 
// 获取数据库信息
let dbGet = async () => {
  db = await dbPromise
}
dbGet()

// 验证是否有cookie
app.route('/')
  .get((req, res) => {
    const userId = req.cookies.userId
    userId ? res.json({code:1,userId}) : res.json({code:0})
  })

// 登录
app.route('/login')
  .post(async (req, res) => {
    //{username: "123", password: "1234", remember: true}
    const info = req.body
    const user = await db.get(
      'SELECT * FROM users WHERE name=? AND password=?',
      info.username,
      info.password
    )
    // 验证信息
    if(user) {
      if(info.remember){
        res.cookie('userId', user.id)  //设置cookie
      }
      res.json({
        code: 1,
        userId: user.id
      })
    }else {
      res.json({
        code: 0
      })
    }
  })   

app.route('/quit')
  .get(async(req, res) => {
    console.log('quit')
    res.clearCookie('userId')
    // 重点，需要发送res，前端监听才能.then
    res.json({
      code:1,
      msg:'清除成功'
    })
  })

// 注册
app.route('/register')
  .post(async (req, res) => {
    console.log(req.body);
    const {username, password, email, title} = req.body

    const user = await db.get('SELECT * FROM users WHERE name=?', username)
    const userEmail = await db.get('SELECT * FROM users WHERE email=?',email)

    if(user) {
      res.json({
        code: -1,
        msg:'用户名已存在'
      })
    } else if(userEmail) {
      res.json({
        code: -1,
        msg:'邮箱已存在'
      })
    } else {
      await db.run(`INSERT INTO users (name, password, email, title) VALUES (?, ?, ?, ?)` ,username , password, email, title)
      res.json({
        code: 1,
      })
    }

  })

module.exports = app