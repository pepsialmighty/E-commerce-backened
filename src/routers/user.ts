import { jwt } from 'jsonwebtoken'
import express from 'express'

import {
  signUpNewUser,
  findAll,
  updateUser,
  deleteUser,
  showProfile,
} from '../controllers/user'
import { logIn } from './../controllers/login'
import JWTservices from '../services/JWT'
import passport from 'passport'

const router = express.Router()

// Every path we define here will get /api/v1/users prefix

// require token before access to "/profile" , using middleware from passport.ts
router.get(
  '/profile',
  passport.authenticate('jwt', {
    session: false,
  }),
  showProfile
)
router.get('/', findAll)
router.post('/signup', signUpNewUser)
router.post('/signin', logIn)
router.put('/:userId', updateUser)
router.delete('/:userId', deleteUser)
// router.get('/profile', JWTservices.validateToken, showProfile)

export default router
