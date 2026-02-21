const { createServer } = require('http')
const next = require('next')
const { Server } = require('socket.io')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res)
  })

  const io = new Server(server)

  io.on('connection', (socket) => {

    socket.on('join', (user) => {
      socket.user = user
    })

    socket.on('new_message', (message) => {
      io.emit('receive_message', message)
    })

    socket.on('typing', (user) => {
      socket.broadcast.emit('user_typing', user)
    })

    socket.on('mark_seen', (data) => {
      io.emit('message_seen', data)
    })
  })

  server.listen(3000, () => {
    console.log('> Ready on http://localhost:3000')
  })
})
