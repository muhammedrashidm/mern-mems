import UserModal from '../models/user.js'
import jwtDecode from 'jwt-decode'
import { ObjectId } from 'mongoose'
import bcrypt from "bcrypt";
import crypto from 'crypto'
import Jwt from 'jsonwebtoken'
import { generateFromEmail, generateUsername } from "unique-username-generator";
export const googleLogin = async (req, res, next) => {

    const credential = req.body.credential
    if (!credential) return res.status(402).json({ message: "Invalid data" })
    const decoded = jwtDecode(credential)

    try {
        const loadedUser = await UserModal.findOne({ googleId: decoded.sub })
        if (loadedUser) {

            const token = Jwt.sign({
                email: loadedUser.email,
                userId: loadedUser._id.toString(),

            }, 'jwtSecret', { expiresIn: '24h' })
            console.log("SUCCESSS");
            return res.status(200).json({
                token: token,
                avatar: loadedUser.avatar,
                firstName: loadedUser.firstName,
                lastName: loadedUser.lastName,
                userId: loadedUser._id.toString(),
            })


        }

        const password = crypto.randomBytes(8).toString('hex')
        const ecryptedPass = await bcrypt.hash(password, 12)
        ///Sned password as email
        const username = await createUserName(decoded.email)
     
           

        const newUser = UserModal({
            googleId: decoded.sub,
            email: decoded.email,
            password: ecryptedPass,
            avatar: decoded.picture,
            firstName: decoded.given_name,
            lastName: decoded.family_name,
            username:username,
            posts: []
        })
        const saved = await newUser.save()

        const token = Jwt.sign({
            email: saved.email,
            userId: saved._id.toString(),

        }, 'jwtSecret', { expiresIn: '24h' })
        return res.status(200).json({
            token: token,
            avatar: saved.avatar,
            firstName: saved.firstName,
            lastName: saved.lastName,
            passwordSend: true, userId: saved._id.toString()

        })


    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }

}



export const register = async (req, res, next) => {
    console.log("CALLED");
    const { email, password, confirmPassword, firstName, lastName } = req.body
    console.log("🚀 ~ file: auth.js:74 ~ register ~ email", email)
    try {
        const existing = await UserModal.findOne({ email: email })
        if (existing) {
            return res.status(203).json({ message: "Email already registered" })
        }
        if (password.trim().toString() !== confirmPassword.trim().toString()) {
            return res.status(204).json({ message: "Password missmatched" })

        }
        const ecryptedPass = await bcrypt.hash(password, 12)
         const username = await createUserName(email)
        const newUser = UserModal({
            email: email,
            firstName: firstName, lastName: lastName,
            password: ecryptedPass
        })

        const user = await newUser.save()

        const token = Jwt.sign({
            email: user.email,
            userId: user._id.toString(),

        }, 'jwtSecret', { expiresIn: '24h' })

        return res.status(200).json({
            token: token,
            avatar: user.avatar,
            firstName: user.firstName,
            lastName: user.lastName,
            userId: user._id.toString(),
        })

    } catch (error) {
        return res.status(500).json({ message: "Server erorr" })
    }


}


export const login = async (req, res, next) => {
    const { email, password } = req.body
    try {
        const user = await UserModal.findOne({ email: email })
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        const isEquel = await bcrypt.compare(password, user.password);
        if (isEquel) {
            const token = Jwt.sign({
                email: user.email,
                userId: user._id.toString(),
            }, 'jwtSecret', { expiresIn: '24h' })

            return res.status(200).json({
                token: token,
                avatar: user.avatar,
                firstName: user.firstName,
                lastName: user.lastName,
                userId: user._id.toString(),
            })


        } else {
            return res.status(403).json({ message: "Unauthorized" })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }




}



const createUserName = async (email) => {
    let nm = generateFromEmail(email)
    const doc = await UserModal.findOne({ username: nm });
    if (!doc) {
        return nm
    } else {
        createUserName(email)
    }
}