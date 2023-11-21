
import express from 'express'
import { googleLogin, register, login } from '../controllers/auth.js'
import { body } from 'express-validator'
import UserModal from '../models/user.js'
const router = express.Router()



router.post('/google-login', googleLogin)

router.post('/register',
    [
        body('email').isEmail().custom(
            async (value, { req }) => {
                const doc = await UserModal.findOne({ email: value })
                if (doc) {
                    return Promise.reject('Email already exists')
                }
            }
        ).normalizeEmail(),
        body('password').isLength({ min: 6 }),
        body('confirmPassword').isLength({ min: 6 }),
        body('firstName').isLength({ min: 6 }),

    ],
    register)


router.post('/login', login)

export default router;