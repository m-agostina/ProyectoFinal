import { Router } from "express"
import { renderProductsController } from "../controllers/product.controller.js"

const productRender = Router()

productRender.get("/render", renderProductsController)

export default productRender
