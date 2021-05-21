import express, { Request, Response, NextFunction } from 'express'
import compression from 'compression'
import session from 'express-session'
import bodyParser from 'body-parser'
import lusca from 'lusca'
import flash from 'express-flash'
import path from 'path'
import mongoose from 'mongoose'
import passport from 'passport'
import dotenv from 'dotenv'
import cors from 'cors'

import movieRouter from './routers/movie'
import userRouter from './routers/user'
import productRouter from './routers/product'
import apiErrorHandler from './middlewares/apiErrorHandler'
import apiContentType from './middlewares/apiContentType'
import passportStrategy from './config/passport'
import cookieParser from 'cookie-parser'

dotenv.config({ path: '.env' })
const app = express()

// Express configuration
app.set('port', process.env.PORT || 3000)

// Use common 3rd-party middlewares
app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(lusca.xframe('SAMEORIGIN'))
app.use(lusca.xssProtection(true))
app.use(cookieParser())

// Initialize passport
app.use(passport.initialize())
app.use(cors())

passport.use(passportStrategy.google)
passport.use(passportStrategy.jwt)

// app.get(
//   '/google/login',
//   passport.authenticate('google-id-token'),
//   (req: Request, res: Response, next: NextFunction) => {
//     console.log(req.user)
//     res.send(req.user)
//   }
// )

// Use movie router
app.use('/api/v1/movies', movieRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/products', productRouter)

// Custom API error handler
app.use(apiErrorHandler)

export default app
