import { Router } from "express"
import passport from "passport"
import { isAdmin } from "../middlewares/authorization.js"
import {updateUserController , getUsersController, deleteUserController} from '../controllers/user.controller.js'

const routerUsers = Router()

routerUsers.put('/premium/:uid', passport.authenticate('current', { session: false }), isAdmin, updateUserController)
routerUsers.get('/', getUsersController)
routerUsers.delete('/', deleteUserController)

export default routerUsers