import jwt from "jsonwebtoken"
import { User } from "../models/user.js"


export const auth = async (req, res, next) => {


    try {

        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'Thisisatoken')
        const user = await User.findOne({ _id: decoded.id, 'tokens.token': token })
        if (!user) {
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please Authenticate' })
    }

}