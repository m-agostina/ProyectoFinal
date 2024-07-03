import Cart from '../models/cart.model.js'
import { createTicketService } from '../services/ticket.service.js'

export const createCart = async ({ code, userId }) => {
    try {
        const newCart = await Cart.create({ code, userId })
        return { 
            message: 'Carrito creado correctamente.',
            data: newCart
        }
    } catch (err) {
        console.error(err)
        throw new Error(`Error al crear el carrito: ${err.message}`)
    }
}

export const getCartById = async (cartId) => {
    try {
        const cart = await Cart.findById(cartId).populate('products.product')
        if (!cart) {
            throw new Error('Carrito no encontrado')
        }
        return { 
            message: 'Carrito cargado correctamente.',
            data: cart
        }
    } catch (err) {
        console.error(err)
        throw new Error('Error al mostrar el carrito: ') + err
    }
}

export const getCartByUserId = async (userId) => {
    try {
      const cart = await Cart.findOne({ userId: userId })
      return cart
    } catch (error) {
      throw new Error(`Error al obtener el carrito: ${error.message}`)
    }
  }

export const addToCart = async (cartId, productId, quantity) => {
    try {
        const cart = await Cart.findById(cartId)
        
        if (!cart) {
            throw new Error('Carrito no encontrado')
        }
        const existingProductIndex = cart.products.findIndex(item => item.product.toString() === productId)
        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity += quantity
        } else {
            cart.products.push({ product: productId, quantity })
        }
        await cart.save()
    } catch (err) {
        console.error(`Error en addToCart: ${err.message}`)
        throw new Error(`Error al agregar el producto el carrito: ${err.message}`)
    }
}
export const deleteFromCart = async (cartId, productId, quantity) => {
    try {
        const cart = await Cart.findById(cartId)
        if (!cart) {
            throw new Error('Carrito no encontrado')
        }
        
        const productIndex = cart.products.findIndex(item => item.product.toString() === productId)
        if (productIndex === -1) {
            throw new Error('Producto no encontrado en el carrito')
        }

        if (quantity === 0) {
            cart.products.splice(productIndex, 1)
        } else {
            cart.products[productIndex].quantity -= quantity
            if (cart.products[productIndex].quantity <= 0) {
                cart.products.splice(productIndex, 1)
            }
        }
        await cart.save()
        return cart
    } catch (err) {
        console.error(err)
        throw new Error(`Error al eliminar el producto del carrito: ${err.message}`)
    }
}

export const deleteAll = async (cartId) => {
    try {
        const cart = await Cart.findById(cartId)
        if (!cart) {
            throw new Error('Carrito no encontrado')
        }

        cart.products = []
        await cart.save()
        return cart
    } catch (err) {
        console.error(err)
        throw new Error(`Error al vaciar el carrito: ${err.message}`)
    }
}

export const deleteCart = async (userId) => {
    try {
      const deletedCart = await Cart.findOneAndDelete({ userId: userId })
      if (!deletedCart) {
        throw new Error('El carrito no fue encontrado o ya fue eliminado')
      }
      return deletedCart
    } catch (error) {
      console.error('Error al eliminar el carrito:', error)
      throw new Error('Error al eliminar el carrito')
    }
  }

export const updateCart = async (cartId, updatedCart) => {
    try {
        const newCart = await Cart.findByIdAndUpdate(updatedCart)
        if (!newCart) {
            throw new Error('Carrito no encontrado')
        }
    } catch (err) {
        console.error(err)
        throw new Error('Error al actualizar el carrito: ') + err
    }
}

export const updateQuantity = async (cartId, productId, quantity) => {
    try {
        const cart = await Cart.findById(cartId)
        if (!cart) {
            throw new Error('Carrito no encontrado')
        }
        const productIndex = cart.products.findIndex(item => item.product.toString() === productId)
        if (productIndex !== -1) {
            cart.products[productIndex].quantity = quantity
            await cart.save()
        } else {
            throw new Error('Producto no encontrado en el carrito')
        }
    } catch (err) {
        console.error(err)
        throw new Error(`Error al actualizar la cantidad de producto en el carrito: ${err.message}`)
    }
}

export const purchase = async (cartId) => {
    try {
        const cart = await Cart.findById(cartId).populate('products.product')
        if (!cart) {
            throw new Error('Carrito no encontrado')
        }

        let productsNotProcessed = []
        let ticketTotal = 0

        for (const item of cart.products) {
            const product = item.product
            if (!product || product.stock < item.quantity) {
                productsNotProcessed.push(item)
            } else {
                product.stock -= item.quantity
                await product.save()
                ticketTotal += product.price * item.quantity
            }
        }

        cart.products = productsNotProcessed
        await cart.save()

        let ticket
        if (ticketTotal > 0) {
            ticket = await createTicketService({
                amount: ticketTotal,
                purchaser: cart.userId
            })
            return { productsNotProcessed, ticket }
        }

        return { productsNotProcessed }
    } catch (error) {
        console.error(error)
        throw new Error(`Error al procesar la compra: ${error.message}`)
    }
}