import jwt from 'jsonwebtoken'
import CustomError from '../services/errors/customError.js'
import EErrors from '../services/errors/errorsEnum.js'
import {generateProductErrorInfo} from '../services/errors/messages/addProduct.error.js'
import { addProduct, getProducts, getProductById, updateProduct, deleteProduct } from '../services/product.service.js'

export const addProductController = async (req, res) => {
    try {
        const product = req.body
        const user = req.user
        let owner
        //REVISAR
        if (user.role === 'premium'){ owner = user.email }

        if (!product.title || !product.description || !product.price || !product.code || !product.category) {
           CustomError.createError({
            name: 'Error al agregar el producto.',
            cause: generateProductErrorInfo(product.title, product.description, product.price, product.code, product.category),
            message: 'Faltan datos para crear el producto.',
            code: EErrors.PRODUCT_ERROR
           })
        }
        //REVISAR
        if (req.file) {
            product.image = `/uploads/${req.file.filename}`
            //product.image = req.file.path
        }

        product.status = true
        const newProduct = await addProduct(product)
        res.status(201).send({ status: 'Success', payload: newProduct })
    } catch (error) {
        console.error(error)
        res.status(500).send({ error: error.code, message: error.message })
    }
}

export const getProductsController = async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sort ? { price: parseInt(sort) } : null
        }

        const filter = {}
        if (query) {
            filter.$or = [
                { category: query },
                { availability: query }
            ]
        }

        const products = await getProducts(options, filter)
        const response = {
            status: products.docs.length > 0 ? "success" : "error",
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage || null,
            nextPage: products.nextPage || null,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `${req.protocol}://${req.get('host')}${req.baseUrl}?page=${products.prevPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}&query=${query || ''}` : null,
            nextLink: products.hasNextPage ? `${req.protocol}://${req.get('host')}${req.baseUrl}?page=${products.nextPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}&query=${query || ''}` : null
        }

        res.status(200).json(response)
    } catch (err) {
        res.status(500).send(`Error al obtener los productos: ${err.message}`)
    }
}

// Función para renderizar la vista de productos
export const renderProductsController = async (req, res) => {
    try {
        const token = req.cookies.cookieToken

        if (token) {
            const decoded = jwt.verify(token, 'secret')
            const userData = decoded.user

            const isAdmin = userData.role === 'admin'
            const isUser = userData.role === 'user'
            const productsData = await getProducts()
            res.render('products', { products: productsData.docs, user: userData, isAdmin, isUser })
        } else {
            const productsData = await getProducts()
            res.render('products', { products: productsData.docs})
        }
    } catch (err) {
        console.error(err)
        res.status(500).send('Error al renderizar la vista de productos')
    }
}

export const manageProdController = async (req, res) => {
    try {
        const token = req.cookies.cookieToken
        if (token) {
            const decoded = jwt.verify(token, 'secret')
            const userData = decoded.user
            const isAdmin = userData.role === 'admin'

            const productsData = await getProducts()
            res.render('manageProd', { products: productsData.docs, user: userData, isAdmin })
        } else {
            res.redirect('/api/sessions/login')
        }
    } catch (err) {
        console.error(err)
        res.status(500).send('Error al renderizar la vista de productos')
    }
}

export const getProductByIdController = async (req, res) => {
    try {
        const id = req.params.pid
        const data = await getProductById(id)
        res.status(200).json({ product: data })
    } catch (err) {
        res.status(500).send(`Error al obtener el producto: ${err.message}`)
    }
}

export const updateProductController = async (req, res) => {
    try {
        const id = req.params.pid
        const updatedProduct = req.body
        const user = req.user

        if (req.file) {
            updatedProduct.image = `/uploads/${req.file.filename}`
        }

        if (user.role === 'admin' || (user.role === 'premium' && product.owner === user.email)) {
            const data = await updateProduct({ _id: id }, updatedProduct)
            res.status(200).json(data)
        } else {
            res.status(403).json({ message: 'No tienes permiso para modificar este producto' })
        }
    } catch (err) {
        console.error('Error al actualizar producto.')
        res.status(500).send(`Error al actualizar el producto: ${err.message}`)
    }
}

export const deleteProductController = async (req, res) => {
    try {
        const id = req.params.pid
        const product = await getProductById(id)
        const token = req.cookies.cookieToken
        
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRETORKEY)
            const userData = decoded.user
            if (userData.role === 'admin' || (userData.role === 'premium' && product.owner === userData.email)){
                const result = await deleteProduct({ _id: id })
                res.status(200).json(result)
            } else {
                res.status(403).json({ message: 'No tienes permiso para eliminar este producto' })
            }
        } else {
            console.error('Error buscando los datos del usuario.')
        }
    } catch (err) {
        console.error('Error al eliminar producto: ', err)
        res.status(500).send(`Error al eliminar el producto: ${err.message}`)
    }
}