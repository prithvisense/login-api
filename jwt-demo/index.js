
const express = require('express')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const db = require('./queries')
const port = 3000
const key = "secret"

const app = express()

app.use(bodyParser.json())

const verifyToken = (req, res, next) => {
    if (typeof req.headers.token !== 'undefined') {
        next()
    } else {
        res.status(400)
        res.send('Please send token')
    }
}

app.listen(port, () => console.log(`listening on localhost ${port}`))

//signup
app.get('/public', (req, res) => {
    res.status(200)
    res.send('public route')
})

//login
app.post('/login', (req, res) => {
    const user = req.body

    // check db and fetch user object and encrypt that
    const token = jwt.sign(user, key, { expiresIn: '1000s' })

    res.status(200)
    res.send(JSON.stringify({ token }))
})

//generating token
app.get('/protected', verifyToken, (req, res) => {
    jwt.verify(req.headers.token, key, (err, data) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                res.status(400)
                res.send("Token expired")
            } else {
                res.status(500)
                res.send("Internal Server Error")
            }
        } else {
            res.status(200)
            res.send('public route')
        }
    })
})

//routes
app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.post('/users', db.createUser)
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)