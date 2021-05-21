import { JWT_SECRET } from './../util/secrets'
import { sign, verify } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

const createToken = (user: {
  email: string
  id: string
  username: string
  isAdmin: boolean
}) => {
  console.log('user from jwt', user)
  const accessToken = sign(
    {
      email: user.email,
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET as string
    // { expiresIn: 60 * 60 * 5 * 1000 }
  )
  return accessToken
}

const validateToken = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies['access-token']

  if (!accessToken)
    return res.status(400).json({ error: 'User not Authenticated' })

  try {
    const validToken = verify(accessToken, process.env.JWT_SECRET as string)
    if (validToken) {
      // create new variable authenticated
      // req.authenticated = true
      return next()
    }
  } catch (error) {
    return res.status(400).json({ error })
  }
}

export default { createToken, validateToken }
