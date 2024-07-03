function obtainCartId() {
  return getCookie("cartId")
}

function getCookie(name) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(";").shift()

  return null
}

document.addEventListener("DOMContentLoaded", () => {
  const userRole = window.userRole
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn")
  const viewCartButton = document.getElementById("view-cart")

  if (viewCartButton) {
    viewCartButton.addEventListener("click", () => {
      if (userRole !== "user") {
        alert("No tienes permiso para agregar productos al carrito.")
        return
      }

      const cartId = obtainCartId()
      if (cartId) {
        window.location.href = `/api/carts/${cartId}`
      } else {
        alert("ID del carrito no definido.")
      }
    })
  }

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      const cartId = getCookie("cartId")

      if (!cartId) {
        alert("ID del carrito no definido.")
        console.error("Error: ID del carrito no definido.")
        return
      }

      const productId = event.target.dataset.productId

      try {
        const response = await fetch(
          `/api/carts/${cartId}/product/${productId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              quantity: 1,
            }),
          }
        )

        if (response.ok) {
          alert("Producto agregado al carrito correctamente.")
        } else {
          alert("Hubo un error al agregar el producto al carrito.")
        }
      } catch (error) {
        console.error("Error:", error)
        alert("Hubo un error al agregar el producto al carrito.")
      }
    })
  })
})
