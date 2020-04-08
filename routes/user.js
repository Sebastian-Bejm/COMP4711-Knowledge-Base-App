const express = require('express');
const userController = require('../controllers/user');
const router = express.Router();
const is_authenticated = require("../util/is-auth");


router.get("/user/seeddb", userController.seedUsers);
router.post('/signup', userController.createUser);
router.get("/register", userController.getRegister);
router.post("/register", userController.register);
router.post("/login", userController.getUser);
router.get("/user/:id", is_authenticated, userController.getProfile);
router.get("/user/:id/edit", is_authenticated, userController.getEditProfile);
router.post("/user/:id/edit", is_authenticated, userController.editProfile);
router.get("/user/:id/likes", is_authenticated, userController.addLike);
router.get("/logout", userController.logout)
    
module.exports = router;