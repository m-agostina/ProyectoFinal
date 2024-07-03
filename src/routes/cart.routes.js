import { Router } from 'express'
import passport from 'passport'
import { isUser } from '../middlewares/authorization.js'
import { addToCartController, 
    getCartByIdController, 
    createCartController, 
    deleteFromCartController, 
    deleteProductCartController,
    updateCartController, 
    updateQuantityController,
    purchaseController } from '../controllers/cart.controller.js'

const routerCart = Router()

routerCart.post('/', createCartController)
routerCart.post('/:cid/product/:pid', passport.authenticate('current', { session: false }), isUser, addToCartController)
routerCart.get('/:cid', getCartByIdController)
routerCart.delete('/:cid/products/:pid', deleteFromCartController)
routerCart.delete('/:cid/product/:pid', deleteProductCartController)
routerCart.delete('/:cid', deleteFromCartController)
routerCart.put('/:cid', updateCartController)
routerCart.put('/:cid/products/:pid', updateQuantityController)
routerCart.put('/:cid/purchase', purchaseController)
routerCart.post('/:cid/purchase', purchaseController)

export default routerCart