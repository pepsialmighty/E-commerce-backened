import express from 'express'

import {
  findAllProduct,
  // findProductByCategory,
  createProduct,
  findProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/product'

const router = express.Router()

// Every path we define here will get /api/v1/products prefix
router.get('/', findAllProduct)
// router.get('/category/:category', findProductByCategory)
router.get('/:productId', findProductById)
router.put('/:productId', updateProduct)
router.delete('/:productId', deleteProduct)
router.post('/', createProduct)

export default router
