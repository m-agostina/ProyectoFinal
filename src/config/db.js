import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const connect = async () => {
    return mongoose.connect(process.env.DB_CONNECTION)
    .then(() =>{
        console.log('Database connected')
    }).catch((err) =>{
        console.log(err)
    })
}

const Database = { connect }

export default Database