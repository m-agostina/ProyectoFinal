import { findById, updateUser, findAllUsers, deleteInactiveUsers } from '../services/user.service.js'
import { deleteAccountEmail } from '../utils/nodemailer.js'

export const updateUserController = async (req, res) => {
    try {
      const { uid } = req.params
      const userFound = await findById(uid)
  
      if (!userFound) {
        return res.status(404).json({ message: 'Usuario no encontrado.' })
      }
  
      let newRole
      if (userFound.role === 'admin') {
        newRole = 'premium'
      } else if (userFound.role === 'premium') {
        newRole = 'admin'
      } else {
        return res.status(400).json({ message: 'No fue posible modificar el rol del usuario.' })
      }
  
      const updatedUser = await updateUser(userFound._id, { role: newRole })
      res.status(200).json({ message: `Rol de usuario actualizado a ${newRole}`, user: updatedUser })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Error al actualizar el rol de usuario.' })
    }
  }

export const getUsersController = async (req, res) => {
    try {
        const users = await findAllUsers()

        const usersData = users.map(user => ({
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          role: user.role,
          lastLogin: user.lastLogin ? user.lastLogin.toLocaleString() : null 
        }))
        res.status(200).json(usersData)
      } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error al obtener los usuarios.' })
      }
}

export const deleteUserController = async (req, res) => {
    try {
        const deletedUsers = await deleteInactiveUsers()

        for (const user of deletedUsers) {
            await deleteAccountEmail(user.email)
        }

        res.status(200).json({ message: 'Usuarios inactivos eliminados', deletedUsers })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error al eliminar usuarios inactivos.' })
    }
}