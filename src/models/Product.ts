import mongoose, { Document } from 'mongoose'

export type ProductDocument = Document & {
  id: string
  name: string
  description: string
  price: number
  countInStock: number
  imageUrl: string
}

const productSchema = new mongoose.Schema({
  id: {
    type: String,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
  },
  countInStock: {
    type: Number,
  },
  imageUrl: {
    type: String,
  },
})

export default mongoose.model<ProductDocument>('Product', productSchema)
