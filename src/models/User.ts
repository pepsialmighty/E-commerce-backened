import mongoose, { Document } from 'mongoose'

export type UserDocument = Document & {
  username: string
  password: string
  email: string
  isAdmin: boolean
  order: string[]
}

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  isAdmin: {
    type: Boolean,
    require: true,
  },
  order: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
  ],
})

export default mongoose.model<UserDocument>('User', userSchema)
