import mongoose from 'mongoose'

const CartSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    products: {
        type: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: {
                type: Number,
                required: true,
                default: 1 
            }
        }]
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

const Cart = mongoose.model('Cart', CartSchema)
export default Cart