import mongoose from 'mongoose'
import mongoPaginate from 'mongoose-paginate-v2'

const UserSchema = new mongoose.Schema({
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    age: {
        type: Number,
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
    },
    role: {
        type: String,
        enum: ['user', 'premium', 'admin'],
        default: 'user'
    },
    lastLogin: {
        type: Date
    }
})

UserSchema.plugin(mongoPaginate)
const User = mongoose.model('User', UserSchema)

export default User