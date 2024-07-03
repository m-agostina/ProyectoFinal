import mongoose from 'mongoose'

const MsgSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    message: []
})

const Msg = mongoose.model('Msg', MsgSchema)
export default Msg