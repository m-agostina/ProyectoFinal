import {Router} from 'express'
import passport from 'passport'
import { isUser } from '../middlewares/authorization.js'

const router = new Router

router.get('/', passport.authenticate('current', { session: false }), isUser, (req, res) => {
    res.render('chat', {})
})

export default router

