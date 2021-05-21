import Product, { ProductDocument } from '../models/Product'

function createProduct(product: ProductDocument): Promise<ProductDocument> {
  return product.save()
}

function findAll(): Promise<ProductDocument[]> {
  return Product.find().sort({ name: 1 }).exec()
}

// function findByCategory(category: string): Promise<ProductDocument[]> {
//   return Product.find({ categories: category }).exec()
// }

function findById(productId: string): Promise<ProductDocument> {
  return Product.findById(productId)
    .exec()
    .then((product) => {
      if (!product) {
        throw new Error(`Product ${productId} not found`)
      }
      return product
    })
}

function update(
  productId: string,
  update: Partial<ProductDocument>
): Promise<ProductDocument> {
  return Product.findById(productId)
    .exec()
    .then((product) => {
      if (!product) {
        throw new Error(`Product ${productId} not found`)
      }

      if (update.name) {
        product.name = update.name
      }
      if (update.description) {
        product.description = update.description
      }
      if (update.price) {
        product.price = update.price
      }
      if (update.countInStock) {
        product.countInStock = update.countInStock
      }
      if (update.imageUrl) {
        product.imageUrl = update.imageUrl
      }

      // Add more fields here if needed
      return product.save()
    })
}

function deleteProduct(productId: string): Promise<ProductDocument | null> {
  return Product.findByIdAndDelete(productId).exec()
}

export default {
  findAll,
  // findByCategory,
  findById,
  createProduct,
  update,
  deleteProduct,
}
