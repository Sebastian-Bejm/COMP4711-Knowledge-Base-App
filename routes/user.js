const express = require('express');
const userController = require('../controllers/user');
const router = express.Router();



router.post('/signup', userController.createUser);
router.get("/register", userController.getRegister);
router.post("/register", userController.register);
router.post("/login", userController.getUser);
router.get("/user/:id", userController.getUserHome);
router.get("/logout", userController.logout)
    
module.exports = router;