import { createCart, getCartById, addToCart, deleteFromCart, deleteAll, updateCart, updateQuantity, purchase } from '../services/cart.service.js'

export const getCartByIdController = async (req, res) => {
    try {
        const cartId = req.params.cid
        const cartData = await getCartById(cartId)
        
        if (cartData) {
            const cartFound = JSON.parse(JSON.stringify(cartData.data))
            res.render('cart', { cart: cartFound })
        } else {
            res.status(404).json({ message: 'Carrito no encontrado' })
        }
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: `Error al cargar el carrito: ${err.message}` })
    }
}

export const createCartController = async (req, res) => {
    try {
        const { code } = req.body
        const newCart = await createCart({ code })

        res.cookie('cartId', newCart._id, { maxAge: 3600000, httpOnly: true })
        res.status(201).send({ status: 'Success', payload: newCart })
    } catch (err) {
        console.error('Error al crear el carrito')
        res.status(500).json({ message: `Error al crear el carrito: ${err.message}` })
    }
}

export const addToCartController = async (req, res) => {
    try {
        const { cid, pid } = req.params
        const quantity = req.body.quantity || 1
        const user = req.user
        let cartId = cid
        let cart = await getCartById(cartId)

        // Si no existe el carrito, crear uno
        if (!cart || !cart.data) {
            const newCart = await createCart({ code: `cart_${Date.now()}` })
            cartId = newCart.data._id
        }

        if(user.role==='premium' && pid.owner === user.email){
            res.json({ message: 'No se pueden agregar productos propios al carrito.' })
        }

        await addToCart(cartId, pid, quantity)
        res.status(200).json({ message: 'Producto agregado al carrito' })
    } catch (err) {
        console.error(err)
        res.status(500).send(`Error al agregar el producto al carrito: ${err.message}`)
    }
}

export const deleteProductCartController = async (req, res) => {
    try {
        const { cid, pid } = req.params
        const quantity = req.body.quantity || 0

        if (!cid) {
            throw new Error('Carrito no encontrado.')
        } else {
            await deleteFromCart(cid, pid, quantity)
            res.status(200).json({ message: 'Producto eliminado del carrito' })
        }

    } catch (err) {
        console.error(err)
        res.status(500).send(`Error al eliminar el producto al carrito: ${err.message}`)
    }
}

export const deleteFromCartController = async (req, res) => {
    try {
        const { cid } = req.params
        const { pid } = req.params

        const { quantity } = req.body
        
        let cart
        if (pid) {
            // Eliminar un producto
            cart = await deleteFromCart(cid, pid, quantity || 1)
        } else {
            // Eliminar todos los productos
            cart = await deleteAll(cid)
        }

        if (!cart) {
            throw new Error('Carrito no encontrado.')
        } else {
            cart.products = []
            res.status(200).json({ send: cart, message: `Carrito con ID ${cid} vacío` })
        }
    } catch (err) {
        console.error(err)
        res.status(500).send(`Error al eliminar todos los productos del carrito: ${err.message}`)
    }
}

export const updateCartController = async (req, res) => {
    try {
        const { cid } = req.params
        const updatedCart = req.body

        if (!cid) {
            throw new Error('Carrito no encontrado.')
        } else {
            await updateCart(cid, updatedCart)
            res.json({ message: `Carrito con ID ${cid} actualizado correctamente` })
        }

    } catch (err) {
        console.error(err)
        res.status(500).send(`Error al actualizar el carrito: ${err.message}`)
    }
}

export const updateQuantityController = async (req, res) => {
    try {
        const { cid, pid } = req.params
        const { quantity } = req.body

        if (!cid) {
            throw new Error('Carrito no encontrado')
        } else {
            await updateQuantity(cid, pid, quantity)
            res.status(200).json({ message: 'Cantidad de productos actualizada en el carrito.' })
        }
    } catch (err) {
        console.error('Error al actualizar cantidad de productos en el carrito: ', err)
        throw err
    }
}

export const purchaseController = async (req, res) => {
    try {
        const { cid } = req.params
        const { productsNotProcessed, ticket } = await purchase(cid)
        const cartData = await getCartById(cid)
        
        if (!cartData) {
            return res.status(404).json({ message: 'Carrito no encontrado' })
        }

        const cartFound = JSON.parse(JSON.stringify(cartData.data))
        
        res.status(200).json({
            message: 'Compra procesada',
            productsNotProcessed,
            ticket,
            cart: cartFound
        })
    } catch (error) {
        console.error(error)
    }
}