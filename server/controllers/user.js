import UserModal from '../models/user.js'


export const getMe = async (req, res, next) => {
    const userId = req.userId
    try {
        const user = await UserModal.findById(userId).select('-password -googleId').populate('posts')
        if (user) {

            res.status(200).json(user)
        }
    } catch (error) {

    }
}



export const patchMe = async (req, res, next) => {
    const userId = req.userId
    const { firstName, lastName } = req.body
    console.log(userId);
    try {
        let saved;
        await UserModal.findByIdAndUpdate(userId, {
            firstName: firstName, lastName: lastName
        }, (err, doc) => {
          if(!err){
              saved = doc
          }
     
           
        })
        if(saved){
          return  res.status(200).json(saved)
        }
        return res.status(500).json({ message: "Failed 37" })
    } catch (error) {
        return res.status(500).json({ message: "Failed 39" })
    }
}

