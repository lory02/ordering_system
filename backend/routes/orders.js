const express = require('express')
const app = express.Router()
const dbPromise = require('../db')

let db;
let dbGet = async () => {
  db = await dbPromise 
}
dbGet();

//socket.io ， 时时更新购物车
var deskCartMap = new Map()
ioServer.on('connection', socket => {
  // 转发用户点菜
  socket.on('new food', info => {
    socket.emit('new food', info)
  })

  // 同一桌用户加入同一个房间
  socket.on('join desk', desk => {
    socket.join(desk)

    // 如果没有购物车，创建一个购物车
    const cartFood = deskCartMap.get(desk)
    if (!cartFood) {
      deskCartMap.set(desk, [])
    }

    // 每加入一个人，播报购物车信息
    socket.emit('cart food', cartFood || [])
  })

  // 监听新食物
  socket.on('new food', info => {
    var foodAry = deskCartMap.get(info.desk)

    var idx = foodAry.findIndex(it => it.food.id === info.food.id)
    var amount = info.amount
    if (idx >= 0) {
      if (amount === 0) {
        foodAry.splice(idx, 1)
      } else {
        foodAry[idx].amount = amount
      }
    } else {
      foodAry.push({
        food: info.food,
        amount: info.amount,
      })
    }
    console.log(foodAry)
    //向info.desk房间广播
    ioServer.in(info.desk).emit('new food', info)
  })
})

// 用户获取food信息
app.get('/menu/restaurant/:rid', async (req, res) => {
  var menu = await db.all(`SELECT * FROM foods WHERE rid = ? AND status = 'on'`, req.params.rid)
  res.json(menu)

})

// 用户下单
app.post('/restaurant/:rid/desk/:did/order', async (req, res) => {

  const {rid, did} = req.params
  const {deskName, totalPrice, customerCount} = req.body
  const details = JSON.stringify(req.body.foods)

  console.log(customerCount)

  const timestamp =  new Date().toISOString()


  await db.run(
    `INSERT INTO orders (rid, did, deskName, customerCount,details, status, timestamp,totalPrice)VALUES(?,?,?,?,?,?,?,?)`, 
      rid, 
      did, 
      deskName, 
      customerCount, 
      details, 
      'pending', 
      timestamp, 
      totalPrice
    )

  let order = await db.get('SELECT * FROM orders ORDER BY id DESC LIMIT 1')
  console.log('status',order.status)
  order.details = JSON.parse(order.details)
  res.json(order)

  deskCartMap.set('desk:' + did, [])
  ioServer.in('desk:' + did).emit('placeOrder success', order)
  ioServer.emit('new order', order);
})


// 查看订单
app.route('/restaurant/:rid/orders')
  .get(async (req, res) => {
    const orders = await db.all('SELECT * FROM orders WHERE rid=?', req.cookies.userId)
    
    // JSON.parse 转换数据格式
    orders.forEach(order=>{
      order.details = JSON.parse(order.details)
    })

    console.log(orders)

    res.json(orders)
 
  })

// 删除订单
app.route('/restaurant/:rid/orders/:oid')
  .delete(async (req, res) => {
    const {oid} = req.params
    const order = await db.run('SELECT * FROM orders WHERE rid=? AND id=?', req.cookies.userId,oid)
    
    if (order) {
      await db.run('DELETE FROM orders WHERE rid=? AND id=?', req.cookies.userId, oid)
      delete order.id
      res.json(order)
    } else {
      res.status(401).json({
        code: -1,
        message: '没有此订单或您无权限操作此订单'
      })
    }
  })

// 修改订单状态
app.route('/restaurant/:rid/orders/:oid/status')
  .put(async (req, res) => {
    console.log(req.body)
    await db.run(
      `UPDATE orders SET status =? WHERE id=? AND rid=?`,
      req.body.status,
      req.params.oid,
      req.cookies.userId
    )
    const order = await db.get('SELECT * FROM orders WHERE id=?', req.params.oid)
    res.json(order)
  })

module.exports = app