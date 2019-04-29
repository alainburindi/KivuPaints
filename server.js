let express =require('express')
let app = express()
let session = require('express-session')

//moteur des template
let bodyParser = require('body-parser')

//Middlewares
app.use('/assets', express.static('public'))
app.use(bodyParser.urlencoded({extended : false}))
app.use(bodyParser.json())
app.use(session({
    secret : "le66lit66",
    resave : false,
    saveUninitialized : true,
    cookie : {secure : false}
}))

app.use(require('./middlewares/flash'))


//Routes
app.set('view engine', 'ejs')

app.get('/',  (req, res) => {
    let Message = require('./models/message')

    Message.all( (messages) =>{
    
        res.render('pages/index', {messages : messages})

    })
})

app.post('/', (req, res)=> {
    if (req.body.message === undefined || req.body.message === '') {
        req.flash('error', "vous n'avez pas entrE un message :(")
    res.redirect('/')
    }else {
        let Message = require('./models/message')
        Message.create(req.body.message,  () => {
            req.flash('success', "Saved correctly")
            res.redirect('/')
        })
    }
    // res.end()
})

app.get('/message/:id', (req, res) => {
    let Message = require('./models/message')
    Message.find(req.params.id, (message) => {
        res.render('messages/show', {message : message})
    })
})

app.listen(8080)