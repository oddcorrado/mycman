'use strict'

const express = require('express')
//const fibo = require('./lib/fibo')
//const messages = require('./lib/messages')
//const morgan = require('morgan')
const players = require('./lib/players')
const bodyParser = require('body-parser')
const session = require('./lib/session')
const game = require('./lib/game')
const scan = require('./lib/scan')

const app = express()

const testMulti = false
module.exports = app

app.disable('x-powered-by')

/*app.use(morgan('dev', {
  immediate: false
}))*/

// npm install serve-static
app.use(express.static(__dirname + '/public'))

// Use the session middleware
app.use(session)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true // ?array[]=1&array[]=2
  // extended: false // ?array=1&array=2
}))

// req :: enhanced http.IncomingMessage
// res :: enhanced http.ServerResponse
app.get('/', (req, res) => {
  res
  //.set('Content-Type', 'text/plain')
  //.status(501)
  .send('Coucou')
})

app.get('/:num([0-9]+).json', (req, res) => {
  const value = fibo(Number(req.params.num))
  const result = {
    input: Number(Number(req.params.num)),
    output: value
  }
  // Super-cache?
  // fs.writeFileSync('public/' + req.params.num + '.json', JSON.stringify(result))
  res.send(result)
})

app.get('/options', (req, res) => {
  res.send(game.getOptions())
})

function restricted (req, res, next) {
  if (req.session.user) {
    next()
  } else {
    res.status(403).send('Not authenticated')
  }
}

app.get('/login', restricted, (req, res) => {
  res.send({ user: req.session.user })
})

/* app.get('/start', restricted, (req, res) => {
  game.start()
  res.send('game started')
}) */

app.get('/logout', (req, res) => {
  console.log('exit')
  players.removePlayer(req.session.user)
  if(testMulti) {
    players.removePlayer(req.session.user + '-1')
    players.removePlayer(req.session.user + '-2')
    players.removePlayer(req.session.user + '-3')
    players.removePlayer(req.session.user + '-4')
    players.removePlayer(req.session.user + '-5')
  }

  //req.session.destroy(()=>res.send('bye bye'))
  req.session = null
  res.send('bye bye')
})

app.post('/login', (req, res) => {
  if (req.body.user) {
    players.addPlayer(req.body.user)
    scan.addUser(req.body.user)
    scan.setId(req.body.user, req.body.id) // TODO check user id
    if(testMulti) {
      players.addPlayer(req.body.user + '-1')
      players.addPlayer(req.body.user + '-2')
      players.addPlayer(req.body.user + '-3')
      players.addPlayer(req.body.user + '-4')
      players.addPlayer(req.body.user + '-5')
    }

    req.session.user = req.body.user
    res.send({ user: req.session.user })
  } else {
    res.status(400).send('Required field: user')
  }
})

/*app.post('/messages', restricted, (req, res) => {
  messages.add(req.session.user, req.body.text)
  .then(message => res.send(message))
  .catch(err => res.status(400).send({
    message: err.message,
    stack: app.get('env') === 'development'
      ? err.stack
      : undefined
  }))
})

app.get('/messages', (req, res) => {
  if (!req.session.user) {
    return res.status(403).send('Not authenticated')
  }

  messages.list(req.query.date, req.query.limit)
  .then(list => res.send(list))
  .catch(err => res.status(400).send({
    message: err.message,
    stack: app.get('env') === 'development'
      ? err.stack
      : undefined
  }))
})*/
