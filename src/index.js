import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import initializePassport from './config/passport.js'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import router from './routes/index.routes.js'

const app = express()
const PORT = 4000


mongoose.connect(process.env.MONGO_URL)
    .then(async () => {
        console.log('BDD conectada')
    })
    .catch(() => console.log('Error en conexion a BDD'))



app.use(express.json())
app.use(cookieParser(process.env.SIGNED_COOKIE)) 
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        mongoOptions: {
            useNewUrlParser: true, 
            useUnifiedTopology: true 
        },
        ttl: 60 

    }),
    secret: process.env.SESSION_SECRET,
    resave: false, 
    saveUninitialized: false 
}))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())


app.use('/', router)


app.listen(PORT, () => {
    console.log(`Server on Port ${PORT}`)
})