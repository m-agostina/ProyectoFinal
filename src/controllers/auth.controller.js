import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import CustomError from '../services/errors/customError.js'
import EErrors from '../services/errors/errorsEnum.js'
import moment from 'moment'
import { generateAuthErrorInfo } from '../services/errors/messages/authentication.error.js'
import { findByEmail, register, updateUser } from '../services/user.service.js'
import { createCart, getCartByUserId } from '../services/cart.service.js'

export const logoutController = async (req, res) => {
  try {
    res.clearCookie("cookieToken")
    res.redirect('/api/sessions/login')
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: `Error loggin out: ${err.message}` })
  }
}

export const loginController = async (req, res) => {
  let { email, password } = req.body

  try {
    const userFound = await findByEmail(email)
    if (!userFound) {
      CustomError.createError({
        name: 'Error de autenticación',
        cause: generateAuthErrorInfo(email),
        message: 'Usuario no encontrado.',
        code: EErrors.USER_NOT_FOUND,
      })
    }

    const passwordMatch = await bcrypt.compare(password, userFound.password)
    if (!passwordMatch) {
      CustomError.createError({
        name: 'Error de autenticación',
        cause: generateAuthErrorInfo(email),
        message: 'Credenciales incorrectas.',
        code: EErrors.PASSWORD_MISMATCH,
      })
    }

    if (passwordMatch) {
      const lastLogin = moment().format('YYYY-MM-DD HH:mm:ss');
      await updateUser(userFound._id, { lastLogin: lastLogin });
      const existingCart = await getCartByUserId(userFound._id)
    let token = jwt.sign({ user: userFound }, process.env.JWT_SECRETORKEY,{ expiresIn: "24h" })

    res.cookie("cookieToken", token, { httpOnly: true })

    if (existingCart) {
      res.redirect("/api/prod/render")
    } else {
      // Si el usuario no tiene un carrito, crear uno nuevo
      const newCart = await createCart({ code: `cart_${Date.now()}`, userId: userFound._id })
      res.cookie("cartId", newCart.data._id.toString(), { httpOnly: false, secure: false  })
      res.redirect("/api/prod/render")
      }
    }else{
      console.error('Error en el login.')
    }

    

  } catch (error) {
    console.error(error)
    res.status(500).send({ error: error.code, message: error.message })
  }
}

export const registerController = async (req, res) => {
  const { email, password, first_name, last_name, age } = req.body
  
  let role = 'user';
  if (email === 'adminCoder@coder.com') {
    role = 'admin';
  } else if (email === 'adminCoder@coder.com.ar') {
    role = 'premium';
  }


  const hashedPassword = await bcrypt.hash(password, 10)

  try {
      const newUser = await register({
          email,
          password: hashedPassword,
          first_name,
          last_name,
          age,
          role
      })

  res.redirect('/api/sessions/login')
  } catch (error) {
      console.error(error)
      res.status(500).send('Error registrando usuario.')
  }
}