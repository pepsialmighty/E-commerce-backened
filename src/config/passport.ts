import passport from 'passport'
import passportLocal from 'passport-local'
import passportFacebook from 'passport-facebook'
import googleStrategy from 'passport-google-id-token'
import dotenv from 'dotenv'
import { Request, Response, NextFunction } from 'express'
import User from '../models/User'
import UserService from '../services/user'
import { JWT_SECRET } from '../util/secrets'
import JWT from 'jsonwebtoken'
import passportJWT from 'passport-jwt'

dotenv.config({ path: '.env' })

const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

const LocalStrategy = passportLocal.Strategy
const FacebookStrategy = passportFacebook.Strategy

const google = new googleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
  },
  (parsedToken: any, googleId: any, done: any) => {
    console.log('parsedToken', parsedToken)
    // const user = User.find()
    done()
  }
)

const jwt = new JWTStrategy(
  {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  },
  async (jwtPayload, done) => {
    const { email } = jwtPayload
    const user = await UserService.findByEmail(email)

    console.log('user from passport', user)

    if (!user) return done(null, false)
    return done(null, user)
  }
)

export default { google, jwt }
