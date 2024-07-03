async function deleteProduct(cartId, productId, quantity) {
  try {
    const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ quantity })
    })
    if (response.ok) {
      location.reload()
    } else {
      console.error('Error al eliminar el producto')
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

async function deleteAll(cartId, productId, quantity) {
  try {
    const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ quantity: 0 })
    })
    if (response.ok) {
      location.reload()
    } else {
      console.error('Error al eliminar el producto')
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

async function emptyCart(cartId) {
  try {
    const response = await fetch(`/api/carts/${cartId}`, { 
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ quantity: 0 })
    })
    if (response.ok) {
      location.reload()
    } else {
      console.error('Error al eliminar todas las cantidades del producto')
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

async function purchaseCart(cartId) {
  try {
    const response = await fetch(`/api/carts/${cartId}/purchase`, {
      method: 'POST'
    })
    const result = await response.json()

    if (response.ok) {
      alert('Compra procesada correctamente')
      window.location.reload()
    } else {
      console.error(result.message)
      alert(`Error: ${result.message}`)
    }
  } catch (error) {
    console.error('Error al procesar la compra:', error)
    alert('Error al procesar la compra')
  }
}