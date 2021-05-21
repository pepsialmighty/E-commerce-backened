import User, { UserDocument } from '../models/User'

function signUpNewUser(user: UserDocument): Promise<UserDocument> {
  return user.save()
}

function findAll(): Promise<UserDocument[]> {
  return User.find().sort({ name: 1 }).exec()
}

function findById(userId: string): Promise<UserDocument> {
  return User.findById(userId)
    .exec()
    .then((user) => {
      if (!user) {
        throw new Error(`User ${userId} not found`)
      }
      return user
    })
}

function findByEmail(email: string): Promise<UserDocument> {
  return User.findOne({ email: email })
    .exec()
    .then((user) => {
      if (!user) {
        throw new Error(`User ${email} not found`)
      }
      return user
    })
}

function updateUserProfile(
  userId: string,
  update: Partial<UserDocument>
): Promise<UserDocument> {
  return User.findById(userId)
    .exec()
    .then((user) => {
      if (!user) {
        throw new Error(`User ${userId} not found`)
      }

      if (update.username) {
        user.username = update.username
      }
      if (update.password) {
        user.password = update.password
      }
      if (update.email) {
        user.email = update.email
      }

      return user.save()
    })
}

function deleteUser(userId: string): Promise<UserDocument | null> {
  return User.findByIdAndDelete(userId).exec()
}

export default {
  signUpNewUser,
  findAll,
  findById,
  findByEmail,
  updateUserProfile,
  deleteUser,
}
