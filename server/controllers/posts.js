import mongoose from "mongoose"
import PostModal from "../models/postModal.js"

import { ObjectId } from "mongoose"
import UserModal from "../models/user.js"
export const getPosts = async (req, res, next) => {
    try {

        const postMessages = await PostModal.find().populate('creator', '-password -posts')
        res.status(200).json({ data: postMessages })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const createPosts = async (req, res, next) => {
    console.log(req.body);
    if (!req.userId) {
        return res.status(403).json({ message: "Unauthorized" })
    }
    const {
        title,
        message,
        selectedFile,
        tags,
    } = req.body
    const post = new PostModal({
        title: title,
        message: message,
        selectedFile: selectedFile.base64 ?? '',
        tags: tags,
        creator: req.userId

    })
  
    try {
        const newPost = await post.save()
        const user = await UserModal.findById(req.userId)

        console.log(newPost._id);
        const updated = await UserModal.findOneAndUpdate({ _id: req.userId },
            { $set: { posts: [...user.posts, newPost._id.toString()] }, }, { new: true })

        res.status(200).json(newPost)


    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }

}



export const updatePosts = async (req, res, next) => {

    const { id: _id } = req.params
    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404)


    try {
        const post = await PostModal.findById(_id)
        if (post.creator.toString() == req.userId.toString()) {
            const updated = await PostModal.findByIdAndUpdate(_id, { ...req.body, _id }, { new: true })
            res.status(200).json(updated)
        } else {
            res.status(403).json({ message: "Unauthorized" })
        }

    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }

}

export const deletePost = async (req, res, next) => {
    const { id: _id } = req.params
    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404)
    try {
        const post = await PostModal.findById(_id)
        if (post.creator.toString() == req.userId.toString()) {
            await PostModal.findByIdAndRemove(_id)
            res.status(203).json({ _id })
        } else {
            res.status(403).json({ message: "Unauthorized" })
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }

}

export const likePost = async (req, res, next) => {
    const { id: _id } = req.params
    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404)
    try {
        const post = await PostModal.findById(_id)
        const likes = post.likes
        const userObjId = mongoose.Types.ObjectId(req.userId)
        const index = likes.findIndex((id) => id.toString() === userObjId.toString())

        if (index === -1) {
            PostModal.updateOne({ _id: _id }, { $push: { likes: req.userId } }, function (err) {
                if (err) {
                    return res.status(500).json({ message: "Failed" })
                } else {
                    return res.status(201).json({ message: "Success", userId: req.userId })
                }
            });
        } else {
            post.likes = likes.filter((item) => {
                return item.toString() !== userObjId.toString()
            })
            post.save()
            return res.status(200).json({ message: "Success", userId: req.userId })
        }

    } catch (error) {
        return res.status(500).json({ message: "Failed" })
    }

}