import express from 'express'
import isAuth from '../middlewares/auth.js'
import { getMe, patchMe } from '../controllers/user.js'
const router = express.Router()



router.get('/me', isAuth, getMe)


router.patch('/me', isAuth, patchMe)

export default router;