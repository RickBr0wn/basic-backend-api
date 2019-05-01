const http = require('http')
const app = require('./app')

// Date.now().toISOString()
// process.env.MONGO_DB

// using the JSON body parser
// app.use(require('body-parser').urlencoded({ extended: false }))
// app.use(require('body-parser').json())

const port = process.env.PORT || 3000
const server = http.createServer(app)

server.listen(port)
