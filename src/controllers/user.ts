import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'

import User from '../models/User'
import UserService from '../services/user'
import {
  NotFoundError,
  BadRequestError,
  InternalServerError,
} from '../helpers/apiError'

// POST /users
export const signUpNewUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, username, password, email } = req.body

    const hashedPassword = await bcrypt
      .hash(password, 10)
      .then((hash) => {
        console.log(typeof hash)
        return hash
      })
      .catch((err) => console.log(err))

    // console.log(hashedPassword)

    const user = new User({
      id,
      username,
      password: hashedPassword,
      email,
      isAdmin: email === 'hainguyenn257@gmail.com' ? true : false,
    })

    await UserService.signUpNewUser(user)
    res.json(user)
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(new InternalServerError('Internal Server Error', error))
    }
  }
}

// PUT /users/:userId
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const update = req.body
    const userId = req.params.userId
    const updatedUser = await UserService.updateUserProfile(userId, update)
    res.json(updatedUser)
  } catch (error) {
    next(new NotFoundError('User not found', error))
  }
}

// GET /users
export const findAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await UserService.findAll())
  } catch (error) {
    next(new NotFoundError('User not found', error))
  }
}

//DELETE /users/:userId
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await UserService.deleteUser(req.params.userId)
    res.status(204).end()
  } catch (error) {
    next(new NotFoundError('User not found', error))
  }
}

export const showProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(req.user)
  } catch (error) {
    next(new NotFoundError('User not found', error))
  }
}
