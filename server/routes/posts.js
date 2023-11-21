import express from 'express'
import isAuth from '../middlewares/auth.js'
import { getPosts, createPosts, updatePosts,deletePost,likePost } from '../controllers/posts.js';

const router = express.Router()



router.get('/', getPosts)

router.post('/', isAuth, createPosts)

router.patch('/:id', isAuth, updatePosts)
router.delete('/:id', isAuth, deletePost)

router.patch('/:id/likePost', isAuth, likePost)
//router.delete('/:id', deletePost)

export default router;