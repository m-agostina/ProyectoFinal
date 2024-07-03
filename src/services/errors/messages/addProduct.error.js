export const generateProductErrorInfo = (title, description, price, code, category) => {
    return `Una de las propiedades del producto no fue completada o no es válida.
    Propiedades requeridas:
    - Título: ${title}
    - Descripción: ${description}
    - Precio: ${price}
    - Categoría: ${category} 
    - Código: ${code}
    `
}