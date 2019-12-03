const sqlite = require('sqlite')

//返回promise
const dbPromise = sqlite.open(__dirname + '/db/restaurant.sqlite3')

module.exports = dbPromise