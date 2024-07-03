import { Router } from 'express'
import passport from 'passport'
import { isAdmin } from '../middlewares/authorization.js'
import { loginController, logoutController, registerController } from '../controllers/auth.controller.js'

const routerAuth = Router()

routerAuth.post('/register', registerController)
routerAuth.post('/login',  loginController)
routerAuth.get('/logout', passport.authenticate('current', { session: false }), logoutController)

export default routerAuth
