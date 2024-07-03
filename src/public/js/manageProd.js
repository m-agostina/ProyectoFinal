//Se crean modales para editar y agregar productos desde el frontend
function initProductButtons() {
    const editProductButtons = document.querySelectorAll('.edit-product-btn')
    const deleteProductButtons = document.querySelectorAll('.delete-product-btn')

    editProductButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.target.dataset.productId
            showEditProductModal(productId)
        })
    })

    deleteProductButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.target.dataset.productId
            deleteProduct(productId)
        })
    })
}

function showEditProductModal(productId) {
    fetch(`/api/prod/${productId}`)
        .then(response => response.json())
        .then(data => {
            if (data.product) {
                const product = data.product
                const modal = createEditProductModal(product)
                document.body.appendChild(modal)
            } else {
                console.error('Error: No se encontró el producto')
            }
        })
        .catch(error => console.error(error))
}

// modal para editar un producto
function createEditProductModal(product) {
    const modal = document.createElement('div')
    modal.classList.add('modal')
    modal.style.display = 'block'

    const modalContent = document.createElement('div')
    modalContent.classList.add('modal-content')

    const modalHeader = document.createElement('div')
    modalHeader.classList.add('modal-header')
    const modalTitle = document.createElement('h2')
    modalTitle.textContent = 'Editar Producto'
    modalHeader.appendChild(modalTitle)

    const closeButton = document.createElement('span')
    closeButton.classList.add('close-button')
    closeButton.innerHTML = '&times;'
    closeButton.addEventListener('click', () => {
        document.body.removeChild(modal)
    })
    modalHeader.appendChild(closeButton)

    const editProductForm = document.createElement('form')
    editProductForm.id = 'edit-product-form'
    editProductForm.enctype = 'multipart/form-data'

    const titleField = createFormField('Título:', 'text', 'title', product.title)
    const descriptionField = createFormField('Descripción:', 'text', 'description', product.description)
    const priceField = createFormField('Precio:', 'number', 'price', product.price)
    const categoryField = createFormField('Categoría:', 'text', 'category', product.category)
    const codeField = createFormField('Código:', 'text', 'code', product.code)
    const stockField = createFormField('Stock:', 'text', 'stock', product.stock)
    const imageField = createImageField(product.image)
    
    editProductForm.appendChild(titleField)
    editProductForm.appendChild(descriptionField)
    editProductForm.appendChild(priceField)
    editProductForm.appendChild(categoryField)
    editProductForm.appendChild(codeField)
    editProductForm.appendChild(stockField)
    editProductForm.appendChild(imageField)

    const submitButton = document.createElement('button')
    submitButton.type = 'submit'
    submitButton.textContent = 'Guardar Cambios'
    submitButton.classList.add('modal-submit-btn')
    editProductForm.appendChild(submitButton)

    modalContent.appendChild(modalHeader)
    modalContent.appendChild(editProductForm)

    modal.appendChild(modalContent)

    document.body.appendChild(modal)

    editProductForm.addEventListener('submit', (event) => {
        event.preventDefault()
        const formData = new FormData(editProductForm)
        updateProduct(product._id, formData)
        document.body.removeChild(modal)
    })

    return modal
}

// Funcion para crear un campo de formulario 
function createFormField(labelText, inputType, name, value) {
    const field = document.createElement('div')
    field.classList.add('form-field')

    const label = document.createElement('label')
    label.textContent = labelText

    const input = document.createElement('input')
    input.type = inputType
    input.name = name
    input.value = value

    field.appendChild(label)
    field.appendChild(input)

    return field
}

// Funcion para el campo de imagen
function createImageField(imageUrl) {
    const imageField = document.createElement('div')
    imageField.classList.add('form-field')

    const imageLabel = document.createElement('label')
    imageLabel.textContent = 'Imagen:'

    const imageInput = document.createElement('input')
    imageInput.type = 'file'
    imageInput.name = 'file'
    imageInput.accept = 'image/*'

    imageField.appendChild(imageLabel)
    imageField.appendChild(imageInput)

    if (imageUrl) {
        const currentImageInfo = document.createElement('p')
        currentImageInfo.textContent = 'Hay una imagen asociada al producto actualmente.'
        currentImageInfo.classList.add('text-muted', 'small')
        imageField.appendChild(currentImageInfo)
    }

    return imageField
}

// Actualizar la vista después de editar
function updateProductView(productId, updatedProduct) {
    const productCard = document.querySelector(`.card[data-product-id="${productId}"]`)
    if (productCard) {
        const titleElement = productCard.querySelector('.card-title')
        const descriptionElement = productCard.querySelector('.card-text:nth-child(2)')
        const priceElement = productCard.querySelector('.card-text:nth-child(3)')
        const categoryElement = productCard.querySelector('.card-text:nth-child(4)')
        const codeElement = productCard.querySelector('.card-text:nth-child(5)')
        const stockElement = productCard.querySelector('.card-text:nth-child(6)')

        titleElement.textContent = updatedProduct.title
        descriptionElement.textContent = updatedProduct.description
        priceElement.textContent = `Precio: $${updatedProduct.price}`
        categoryElement.textContent = `Categoría: ${updatedProduct.category}`
        codeElement.textContent = `Código: ${updatedProduct.code}`
        stockElement.textContent = `Stock: ${updatedProduct.stock}`
    }
}

// Actualizar en el servidor
function updateProduct(productId, formData) { 
    fetch(`/api/prod/${productId}`, {
        method: 'PUT',
        body: formData 
    })
        .then(response => {
            if (response.ok) {
                const updatedProduct = Object.fromEntries(formData.entries())
                updateProductView(productId, updatedProduct)
            } else {
                console.error('Error al actualizar el producto')
            }
        })
        .catch(error => console.error(error))
}

function deleteProduct(productId) {
    fetch(`/api/prod/${productId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            const productCard = document.querySelector(`.card[data-product-id="${productId}"]`)
            if (productCard) {
                productCard.remove()
            }
        } else {
            console.error('Error al eliminar el producto')
        }
    })
    .catch(error => console.error(error));
}

// botones de editar y agregar producto
document.addEventListener('DOMContentLoaded', () => {
    initProductButtons()

    const addProductBtn = document.getElementById('add-product-btn')
    addProductBtn.addEventListener('click', showAddProductModal)
})

// agregar nuevo producto
function createAddProductModal() {
    const modal = document.createElement('div')
    modal.classList.add('modal')
    modal.style.display = 'block'

    const modalContent = document.createElement('div')
    modalContent.classList.add('modal-content')

    const modalHeader = document.createElement('div')
    modalHeader.classList.add('modal-header')
    const modalTitle = document.createElement('h2')
    modalTitle.textContent = 'Agregar Producto'
    modalHeader.appendChild(modalTitle)

    const closeButton = document.createElement('span')
    closeButton.classList.add('close-button')
    closeButton.innerHTML = '&times;'
    closeButton.addEventListener('click', () => {
        document.body.removeChild(modal)
    })
    modalHeader.appendChild(closeButton)

    const addProductForm = document.createElement('form')
    addProductForm.id = 'add-product-form'

    // titulo
    const titleField = createFormField('Título:', 'text', 'title', '')
    const descriptionField = createFormField('Descripción:', 'text', 'description', '')
    const priceField = createFormField('Precio:', 'number', 'price', '')
    const categoryField = createFormField('Categoría:', 'text', 'category', '')
    const codeField = createFormField('Código:', 'text', 'code', '')
    const stockField = createFormField('Stock:', 'text', 'stock', '')

    // imagen
    const imageField = createImageField()
    addProductForm.appendChild(imageField)

    addProductForm.appendChild(titleField)
    addProductForm.appendChild(descriptionField)
    addProductForm.appendChild(priceField)
    addProductForm.appendChild(categoryField)
    addProductForm.appendChild(codeField)
    addProductForm.appendChild(stockField)

    const submitButton = document.createElement('button')
    submitButton.type = 'submit'
    submitButton.textContent = 'Agregar Producto'
    submitButton.classList.add('modal-submit-btn')
    addProductForm.appendChild(submitButton)

    modalContent.appendChild(modalHeader)
    modalContent.appendChild(addProductForm)

    modal.appendChild(modalContent)

    document.body.appendChild(modal)

    addProductForm.addEventListener('submit', (event) => {
        event.preventDefault()
        const formData = new FormData(addProductForm)
        addProduct(formData)
        document.body.removeChild(modal)
    })
}

function showAddProductModal() {
    const modal = createAddProductModal()
}

// nuevo producto al servidor
function addProduct(formData) {
    fetch('/api/prod', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (response.ok) {
                location.reload()
            } else {
                console.error('Error al agregar el producto')
            }
        })
        .catch(error => console.error(error))
}