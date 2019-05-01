const http = require('http')
const app = require('./app')

// Date.now().toISOString()
// process.env.MONGO_DB

const port = process.env.PORT || 3000
const server = http.createServer(app)

server.listen(port)
