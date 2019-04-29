let connection = require('./config/connection')
let table = 'messages'
    
let select = 'SELECT'

let columnsSetted = false


class Model{

    // constructor(){
    // }
    static all (){
        columnsSetted != columnsSetted
        select += ' * FROM '+ table
        return this
    }


    // select specific columns
    static specific(columns){
        if (columns) {
            if (columns instanceof Array) {
                let length = columns.length
                    for (let i in columns) {
                        select += ' ' + columns[i]
                        select += (i != 1 && i < length-1) ? ' , ' : ''
                    }
                    columnsSetted != columnsSetted
            }else{
                select += ' ' + columns
            }
            select += ' FROM ' + table
        }else{
            this.error('make sure to put columns')
        }
        // let compare = (comparison) ? comparison : ' and '
        return this

        
    }
    
    //where arguments
    static where (columns, values) {

        if (columns && values) {
            if (columns instanceof Array && values instanceof Array) {
                let length = columns.length
                if (length == values.length) {
            select += ' WHERE '
                    for (let i in columns) {
                let column, comparator = 'and', value, sign = ' ='
                        column = columns[i].split(' ')
                        if (column.length == 2) {
                            comparator = column[0].replace('c_', ' ')
                            
                            column = column[1]
                        }
                        i != 0 && i < columns.length ?  select += comparator : ''
                        value = values[i].split(' ')
                        if (value.length >= 2){
                            sign = value[0]
                            if (sign[0] == 's' && sign[1] == '_') {
                                value.splice(0, 1)
                                sign = sign.replace('s_',' ')
                                console.log(sign)
                            }
                        }
                        
                        select += ' ' + column + sign +'  "' + value + '"'
                    }
                    console.log(select)
                }else{
                    this.error( 'colums and values are not equal ny size')
                }
            }else if(!(columns instanceof Array) && !(values instanceof Array)){
                select += ' WHERE ' + columns + ' = ' + values
            }else{
                this.error('not identic maybe array and value given')
            }
        }else{
            tthis.error('make sure to put columns and values')
        }

        return this
    }
    
    //run the sql statement or prepared query
    static get(){
        connection.query(select, (error, results, fields)=>{
            if (error) throw error
            console.log(results)
        }
    )}
 
    //throe predefined errors  
    static error(m){
        throw new Error(m)
    }
}

Model.all().where(['id', 'c_or content'], ['2', 'first']).get()
//remain to treate the string in values 
//treat error if he enter many values which are noy in array
// Model.specific('id', 'content').where(['id', 'content'], [1,'"first"']).get()