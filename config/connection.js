let mysql = require('mysql')

let connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'kivupaint'
})

connection.connect()

module.exports = connection