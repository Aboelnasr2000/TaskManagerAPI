import mongoose from "mongoose";
import validator from "validator";
import bycrpt from 'bcryptjs';
import jwt from "jsonwebtoken";
import { Task } from "./task.js";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email Invalid!')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age Must Be A Positive Number!')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password Can not Contain The Word Password')
            }
        }

    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }], avatar: {
        type: Buffer,
    }

}, {
    timestamps: true
})


userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner',
})


//Instance Methods
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject

}



userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '7 days' })
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

//Model Methods
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bycrpt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bycrpt.hash(user.password, 8)
    }
    next()
})

// userSchema.pre('deleteOne', async function (next) {
//     const user = this
//     console.log(user._id)
//     await Task.deleteMany({Owner:user._id})
//     next()
// })

export const User = mongoose.model('User', userSchema);