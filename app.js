const express = require('express')
const routesManager = require('./routes/routesManager')
const bodyParser = require('body-parser')
const cors = require('cors')

// For envirement variables
require('dotenv').config()

const app = express()

app.use(cors({
  origin: process.env.CORS_ORIGIN
}))

app.use(bodyParser.json())
app.use('/', routesManager)

// default port 3000
app.listen(process.env.PORT || 3000)
