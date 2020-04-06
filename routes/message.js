const express = require('express');
const messageController = require('../controllers/message');
const router = express.Router();
const is_authenticated = require("../util/is-auth");


router.get("/user/:id/message/new", is_authenticated, messageController.getNewMessage)
router.post("/user/:id/message", is_authenticated, messageController.sendMessage)

    
module.exports = router;