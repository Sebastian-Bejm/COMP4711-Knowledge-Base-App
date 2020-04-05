const express = require('express');
const postController = require('../controllers/post');
const router = express.Router();



router.post('/user/:id/post', postController.createPost);
router.post("/search", postController.search);
router.get("/search", postController.search);
router.post("/user/:id/post/:post_id/reply", postController.addReply);



module.exports = router;