import Jwt from 'jsonwebtoken'
export default (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader) {
        return res.status(403).json({ message: "Unauthorisez" })
    }
    const token = authHeader.split(' ')[1]
    if (!token) {
        return res.status(403).json({ message: "Unauthorisez" })
    }
    let decoded;
    try {

        decoded = Jwt.verify(token, 'jwtSecret')


    } catch (error) {
        return res.status(403).json({ message: "Unauthorisez" })
    }

    req.userId = decoded.userId
    req.userMail = decoded.email
    next()
}