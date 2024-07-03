import { Router } from "express"
import { sendEmail, resetPassword, newToken } from "../controllers/password.controller.js"

const routerPassword = Router()

routerPassword.post('/forgotPassword', sendEmail)
routerPassword.post('/resetPassword/:token', resetPassword)
routerPassword.post('/forgotPassword/resend', newToken)
  
export default routerPassword