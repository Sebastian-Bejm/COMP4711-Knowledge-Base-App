const express = require('express');
const postController = require('../controllers/post');
const userController = require('../controllers/user');
const router = express.Router();
const is_authenticated = require("../util/is-auth");


router.post('/user/:id/post', is_authenticated, postController.createPost);
router.get("/user/:id/post", is_authenticated, userController.getCurrentUserPosts)
router.post("/search", is_authenticated, postController.search);
router.get("/search", is_authenticated, postController.search);
router.post("/user/:id/post/:post_id/reply", is_authenticated, postController.addReply);



module.exports = router;