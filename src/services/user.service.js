import User from '../models/user.model.js'
import moment from 'moment'

export const register = async (user) => {
    try {
        const newUser = new User(user)
        return await newUser.save()
    } catch (err) {
        console.error(err)
        throw new Error(`Error al crear usuario: ${err.message}`)
    }
}

export const findByEmail = async (email) => {
    try {
        return await User.findOne({ email: email })
    } catch (err) {
        console.error(err)
        throw new Error(`Error al buscar el usuario: ${err.message}`)
    }
}

export const findById = async (id) => {
    try {
        return await User.findById(id)
    } catch (err) {
        console.error(err)
        throw new Error(`Error al buscar el usuario: ${err.message}`)
    }
}

export const updateUser = async (userId, updateData) => {
    try {
        console.log(`Updating user with ID: ${userId} with data: ${JSON.stringify(updateData)}`);
      const updatedUser = await User.findByIdAndUpdate(userId, { $set: updateData }, { new: true })
      return updatedUser
    } catch (err) {
      console.error(err)
      throw new Error(`Error al actualizar el usuario: ${err.message}`)
    }
}

export const findAllUsers = async () => {
    try {
      return await User.find()
    } catch (err) {
      console.error(err)
      throw new Error(`Error al obtener los usuarios: ${err.message}`)
    }
}

export const deleteInactiveUsers = async () => {
    try {
        const twoDaysAgo = moment.utc().subtract(10, 'minutes')
        console.log(twoDaysAgo)
        const inactiveUsers = await User.find({ lastLogin: { $lt: twoDaysAgo } })
        console.log(inactiveUsers)
        await User.deleteMany({ _id: { $in: inactiveUsers.map(user => user._id) } })
        return inactiveUsers
    } catch (err) {
        console.error(err)
        throw new Error(`Error al eliminar usuarios inactivos: ${err.message}`)
    }

}
