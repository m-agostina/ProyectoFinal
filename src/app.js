import express from 'express'
import dotenv from 'dotenv'
import passport from 'passport'
import  { initializePassport } from './config/passport.js'
import http from 'http'
import { engine } from 'express-handlebars'
import Database from './config/db.js'
import socketServer from './config/messages.js'
// Routes
import productRoutes from './routes/product.routes.js'
import productView from './routes/product.view.routes.js'
import cartRoutes from './routes/cart.routes.js'
import chatRoutes from './routes/chat.routes.js'
import authRoutes from './routes/auth.routes.js'
import userView from './routes/auth.views.routes.js'
import routerPassword from './routes/password.routes.js'
import routerUsers from './routes/users.routes.js'
// Path
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import cookieParser from 'cookie-parser'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const app = express()
app.use(express.static(path.join(__dirname, 'public')))

// Inicializaciones
dotenv.config()
const PORT = process.env.PORT
app.use(express.json())
app.use(express.urlencoded({ extended: true })) 
app.use(cookieParser())
app.use(passport.initialize())
initializePassport()
const server = http.createServer(app)
socketServer(server)

// Handlebars
const hbs = engine({
    extname: '.handlebars',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials'),
    helpers: {
        eq: function(a, b) {
            return a === b;
        }
    }
})
app.engine('handlebars', hbs)
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views')

// Routes
app.use('/api/prod', productView)
app.use('/api/prod', productRoutes)
app.use('/api/carts', cartRoutes)
app.use('/chat', chatRoutes)
app.use('/api/sessions', userView)
app.use('/auth', authRoutes)
app.use('/api/password', routerPassword)
app.use('/api/users', routerUsers)

server.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
    Database.connect()
})