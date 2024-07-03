import nodemailer from 'nodemailer'
import { resetPassword } from '../public/templates/resetPassword.js'
import { deleteAccount } from '../public/templates/deleteAccount.js'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
})

export const sendResetPassword = async (email, resetLink) => {
    const htmlToSend = resetPassword(resetLink)

    try {
        let mensaje = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subjet: 'Restablecer contraseña',
            html: htmlToSend
        })

    } catch (error) {
        console.error('Error al enviar el correo:', error)
    }
}

export const deleteAccountEmail = async (email) => {
    const htmlToSend = deleteAccount
  
    try {
      let mensaje = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Cuenta eliminada por inactividad.',
        html: htmlToSend,
      })
      console.log('Correo enviado:', mensaje.response)
    } catch (error) {
      console.error('Error al enviar el correo:', error)
    }
  }