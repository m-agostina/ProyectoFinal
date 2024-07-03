import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { findByEmail } from '../services/user.service.js'
import { sendResetPassword } from '../utils/nodemailer.js'

export const sendEmail = async (req, res) => {
    try {
        const { email } = req.body
        const user = await findByEmail(email)
        if (!user) {return res.status(404).json({ message: 'Usuario no encontrado.' })}

        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRETORKEY, { expiresIn: '1h' })
        const resetLink = `${req.protocol}://${req.get('host')}/reset-password/${token}`
        await sendResetPassword(email, resetLink)

        res.json({ message: 'Se ha enviado un correo electrónico con instrucciones para restablecer la contraseña.' })
    } catch (error) {
        return res.status(500).json({ message: 'Error al enviar el correo de restablecimiento.' })     
    }
} 

export const resetPassword = async (req, res) => {
  try {
	  const { token } = req.params
    const { newPassword } = req.body
    const { email } =req.body
  
    const decoded = jwt.verify(token, process.env.JWT_SECRETORKEY)

    const user = await findByEmail(decoded.email)
    if (!user) {return res.status(404).json({ message: 'Usuario no encontrado.' })}

    const passwordMatch = await bcrypt.compare(newPassword, user.password)
    if (passwordMatch) {return res.status(400).json({ message: 'La nueva contraseña no puede ser la misma que la anterior.' })}

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    user.password = hashedPassword
    await user.save()

    res.json({ message: 'Contraseña restablecida correctamente.' })
	} catch (error) {
    if (error.name === 'TokenExpiredError') {return res.status(400).json({ message: 'El token ha expirado.' })}
    console.error(error)
    res.status(500).json({ message: 'Error al restablecer la contraseña.' })
  }
}

export const newToken = async (req, res) => {
  try {
    const { email } = req.body
    const user = await findByEmail( email )
  
    if (!user) { return res.status(404).json({ message: 'Usuario no encontrado.' })}
  
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRETORKEY, { expiresIn: '1h' })
    const resetLink = `${req.protocol}://${req.get('host')}/reset-password/${token}`
    await sendResetPassword(email, resetLink)

    res.json({ message: 'Se ha enviado un nuevo correo electrónico con instrucciones para restablecer la contraseña.' })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al generar un nuevo token.' })  
  }
}