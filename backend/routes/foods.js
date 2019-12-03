const express = require('express')
const app = express.Router()
const multer = require('multer')
const path = require('path')
const dbPromise = require('../db')

let db 
let dbGet = async () => {
  db = await dbPromise
}
dbGet();

//multer配置,保存路径和文件名
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // bug: 相对工作目录(backend)
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))  
  }
})

const upLoader = multer({
  storage
})


//菜单管理 (增，删，改，查)
app.route('/restaurant/:rid/foods')
  .get(async (req, res) => {
    
    var foodList = await db.all(
      'SELECT * FROM foods WHERE rid=?',
      req.cookies.userId
    );
    
    res.json(foodList)
  })
  .post(upLoader.single('img'), async(req, res) => {
    const info = req.body
    await db.run(`
      INSERT INTO foods (rid, name, price, status, desc, category, img)
      VALUES (?,?,?,?,?,?,?)
    `,
      req.cookies.userId,
      info.name,
      info.price,
      info.status,
      info.desc,
      info.category,
      req.file.filename,
    )
    
    var food = await db.get(`SELECT * FROM foods ORDER BY id DESC LIMIT 1`) // 倒数第一个
    res.json(food)

  })

app.route('/restaurant/:rid/foods/:fid')
  .delete(async (req, res) => {
    const fid = req.params.fid
    const userId = req.cookies.userId
    let food = await db.get(
      'SELECT * FROM foods WHERE id=? AND rid=?',
      fid,
      userId
    )
    if (food) {
      await db.run(
        'DELETE FROM foods WHERE id=? AND rid=?',
        fid,
        userId
      )
      delete food.id
      res.json(food)
    } else {
      res.status(401).json({
        code: -1,
        message: '不存在此菜品或您无权限删除此菜品'
      })
    }
  })
  .put( upLoader.single('img'), async(req, res)=>{
    const fid = req.params.fid
    const userId = req.cookies.userId
    let food = await db.get(
      'SELECT * FROM foods WHERE id=? AND rid=?',
      fid,
      userId
    )

    function merge( food, updateInfo) {
      const obj = {
        name: '',
        price: '',
        status: '',
        desc: '',
        category: '',
        img: ''
      }

      for(var key in obj) {
        if(key !== 'img') {
          obj[key] = updateInfo[key] ? updateInfo[key] : food[key]
        } else {
          obj[key] = req.file ? req.file.filename : food.img
        }
      }
      return obj
    }

    let {name, price, status, desc, category, img} = merge(food, req.body)

    await db.run(
      `UPDATE foods SET name=?, price=?, status=?, desc=?, category=?, img=? WHERE id=? AND rid=?`,
       name,
       price,
       status,
       desc,
       category,
       img,
       fid,
       userId
    )
    
    let foodInfo = await db.get('SELECT * FROM foods WHERE id=? AND rid=?', fid, userId)
    res.json(foodInfo)
    
  })

module.exports = app