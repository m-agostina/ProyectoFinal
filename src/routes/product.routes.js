import { Router } from "express"
import passport from 'passport'
import { isAdmin, isAdminOrPremium } from '../middlewares/authorization.js'
import { uploader } from "../utils/multer.js"
import {
  addProductController,
  getProductsController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
  manageProdController
} from "../controllers/product.controller.js"

const routerPr = Router()

routerPr.post("/", passport.authenticate('current', { session: false }), isAdminOrPremium, uploader.single('file'), addProductController)
routerPr.get("/products", getProductsController)
routerPr.get("/manage", passport.authenticate('current', { session: false }), isAdmin, manageProdController)
routerPr.get("/:pid", getProductByIdController)
routerPr.put("/:pid", uploader.single('file'), updateProductController)
routerPr.delete("/:pid", deleteProductController)

export default routerPr
