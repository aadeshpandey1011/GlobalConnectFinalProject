const express = require('express');
const router = express.Router();
const UserController = require('../controller/user')


router.post('/register', UserController.register)
router.post('/login',UserController.login)
router.post('/google',UserController.loginThroghGmail)



module.exports = router;