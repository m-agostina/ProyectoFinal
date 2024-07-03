import productModel from '../models/product.model.js'

export const addProduct = async (product) => {
    try {
        const newProduct = await productModel.create(product)
        return newProduct
    } catch (err) {
        console.error(err)
    }
}

export const getProducts = async (options, filter) => {
    try {
        const products = await productModel.paginate(filter, { ...options, lean: true })
        return products
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const getProductById = async (id) => {
    try {
        const product = await productModel.findById(id)
        return product
    } catch (err) {
        console.error(err)
        throw new Error('Error al mostrar el producto: ' + err.message)
    }
}

export const updateProduct = async (id, updatedProduct) => {
    try {
        const result = await productModel.findOneAndUpdate({ _id: id }, updatedProduct)
        return result
    } catch (err) {
        console.error(err)
        throw new Error(`Error al actualizar el producto: ${err.message}`)
    }
}

export const deleteProduct = async (id) => {
    try {
        const result = await productModel.deleteOne({ _id: id })
        return result
    } catch (err) {
        console.error(err)
        throw new Error(`Error al eliminar el producto: ${err.message}`)
    }
}