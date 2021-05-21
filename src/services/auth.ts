import { JWT_SECRET } from './../util/secrets'
import User, { UserDocument } from '../models/User'
import jwt from 'jsonwebtoken'

const findOrCreate = async (parsedToken: any): Promise<UserDocument> => {
  const { email, username } = parsedToken
  const user = await User.findOne({ email })

  if (!user) {
    const newUser = new User({
      email,
      username,
      isAdmin: email === 'pepsi@gmail.com' ? true : false,
    })

    return newUser.save()
  }

  return user
}

const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string)
}

export default { findOrCreate, generateToken }
