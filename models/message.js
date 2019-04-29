let connection = require('../config/connection')
let moment = require('moment')

class Message{

    constructor(row){
        this.row = row
    }

    get id() {
        return this.row.id
    }

    get content() {
        return this.row.content
    }

    get created_at() {
        return moment(this.row.created_at)
    }
    static create(content, cb){
        let sql = "INSERT INTO Messages SET content = ?, created_at = ?"
        connection.query(sql, [
            content, new Date()], (error, result, fields) => {
                if (error) throw error
                cb(result)
            }
        )
    }

    static all(cb){
        let sql = 'SELECT * FROM messages'
        connection.query(sql, (error, results, fields)=> {
            // error will be an Error if one occurred during the query
            if (error) throw error
            // results will contain the results of the query
            cb(results.map((row) => new Message(row)))
            // fields will contain information about the returned results fields (if any)
        })
    }

    static find(id, cb){
        let sql = 'SELECT * FROM messages WHERE id = ? LIMIT 1'
        connection.query(sql, [id], (error, results, fields)=> {
            // error will be an Error if one occurred during the query
            if (error) throw error
            // results will contain the results of the query
            cb(new Message(results[0]))
            // fields will contain information about the returned results fields (if any)
        })
    }
}

module.exports = Message