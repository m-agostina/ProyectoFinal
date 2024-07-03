import { Router } from 'express'
import passport from 'passport'

const userRender = Router()

userRender.get('/login', (req, res) =>{ res.render('login') })
userRender.get('/register', (req, res) =>{ res.render('register') })
userRender.get('/current', passport.authenticate('current', {session:false}),(req, res) =>{
    const user = req.user.user
    const userDTO = {
        first_name: user.first_name,
        last_name: user.last_name,
        age: user.age,
        email: user.email,
        role: user.role
    }
    res.render('profile', { user: userDTO })
})

export default userRender