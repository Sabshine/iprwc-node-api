const express = require('express')
const UserController = require('../controllers/userController')

const router = express.Router()

router.get('/:email/exists/', UserController.exists)
router.get('/id/:email', UserController.getUserId)

module.exports = router
