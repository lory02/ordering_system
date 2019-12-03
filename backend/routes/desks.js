const express = require('express')
const app = express.Router()
const dbPromise = require('../db')

let db;
let dbGet = async () => {
  db = await dbPromise 
}
dbGet();

app.get('/deskInfo', async (req, res) => {
  var desk = await db.get(`
    SELECT 
    desks.id as did,
    users.id as uid,
    desks.name,
    users.title
    FROM desks JOIN users ON desks.rid = users.id
    WHERE desks.id=?
  `, req.query.did)

  res.json(desk)
})

// 桌面管理 (查，增，删， 改)
app.route('/restaurant/:rid/desks')
  .get(async (req, res) => {
    console.log('desk')
    const deskList = await db.all(
      'SELECT * FROM desks WHERE rid=?',
      req.cookies.userId
      )
    
    res.json(deskList)
  })
  .post (async (req, res) => {
    const deskInfo = req.body
    await db.run(`
    INSERT INTO desks (rid, name , capacity) VALUES (?, ?, ?)`,
    req.cookies.userId,
    deskInfo.name,
    deskInfo.capacity
    )
    const desk = await db.get('SELECT * FROM desks ORDER BY id DESC LIMIT 1')
    res.json(desk)
  })

app.route('/restaurant/:rid/desks/:did')
  .delete(async(req, res) => {
    const did = req.params.did
    const userId = req.cookies.userId

    const desk = await db.get(`SELECT * FROM desks WHERE id=? AND rid=?`, did, userId)
    if(desk) {
      await db.run(`DELETE FROM desks WHERE id=? AND rid=?`, did, userId)
      delete desk.id
      res.json(desk)
    } else {
      res.status(401).json({
        code: -1,
        message: '不存在此桌或您无权限删除'
      })
    }
  })
  .put(async (req, res) => {
    const did = req.params.did
    const userId = req.cookies.userId
    const deskInfo = req.body

    let desk = await db.get(`SELECT * FROM desks WHERE id=? AND rid=?`, did, userId)
    if(desk) {
      await db.run(
        `UPDATE desks SET name=?, capacity=? WHERE id=? AND rid=?`,
        deskInfo.name,
        deskInfo.capacity,
        did,
        userId
      )
      desk = await db.get(`SELECT * FROM desks WHERE id=? AND rid=?`, did, userId)
      res.json(desk)
    } else {
      res.status(401).json({
        code: -1,
        message: '不存在此桌或您无权限修改'
      })
    }
  })


module.exports = app