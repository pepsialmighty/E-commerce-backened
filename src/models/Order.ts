import mongoose, { Document } from 'mongoose'

export type OrderDocument = Document & {
  product: string[]
  user: string
  orderDate: Date
}

const orderSchema = new mongoose.Schema({
  product: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      index: true,
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  orderDate: {
    type: Date,
  },
})

export default mongoose.model<OrderDocument>('Order', orderSchema)
