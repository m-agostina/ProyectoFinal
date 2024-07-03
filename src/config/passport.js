import { Strategy as JwtStrategy } from "passport-jwt"
import { ExtractJwt } from "passport-jwt"
import passport from "passport"
import dotenv from 'dotenv'

dotenv.config()

const initializePassport = () => {
    passport.use('current', new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.JWT_SECRETORKEY//'secret'
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload)
        } catch (err) {
            return done('Error creating JWT-Passport: ' + err)
        }
    }))
}

const cookieExtractor = function(req){
    let token = null
    if(req && req.cookies){
        token = req.cookies['cookieToken']
    }
    return token
}

/* NO SE ESTA USANDO, SINO EXPORTAR
const authorization = () => {
    return (req, res, next) => {
        if(!req.user) return res.status(401).send({message: 'Unauthorized.'})
            
        next()
    }
}*/

export { initializePassport } 