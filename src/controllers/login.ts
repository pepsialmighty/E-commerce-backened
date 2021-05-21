import { UserDocument } from './../models/User'
import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'

import { BadRequestError, InternalServerError } from '../helpers/apiError'
import User from '../models/User'
import UserService from '../services/user'

// services from JWT service
import JWTService from '../services/JWT'

export const logIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body

    // find User in DB via email
    const user = await User.findOne({ email })

    if (!user) res.status(400).json({ error: "User doesn't exist" })

    const dbPassword = user?.password
    console.log('hello', user)

    // Check user password
    dbPassword &&
      bcrypt.compare(password, dbPassword).then((match) => {
        if (!match) {
          return res.status(400).json({ error: 'Wrong User of Password' })
        } else {
          // create new token then send it
          const accessToken = user && JWTService.createToken(user)
          // res.cookie('access-token', accessToken, {
          //   maxAge: 60 * 60 * 24 * 1000,
          //   httpOnly: true,
          // })
          const { email, id, username, isAdmin } = user as UserDocument
          res.status(200).json({ accessToken, email, id, username, isAdmin })
          // res.status(200).json(accessToken)
        }
      })
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(new InternalServerError('Internal Server Error', error))
    }
  }
}
