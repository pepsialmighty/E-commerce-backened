import Product from '../../src/models/Product'
import ProductService from '../../src/services/product'
import * as dbHelper from '../db-helper'

const nonExistingProductId = '603eae50965e8f05f016d6c1'

async function createProduct() {
  const product = new Product({
    name: 'Chair',
    description: 'Brown Chair',
    categories: 'Furniture',
    variant: 'variant',
    sizes: 'big',
  })
  return await ProductService.createProduct(product)
}

describe('product service', () => {
  beforeEach(async () => {
    await dbHelper.connect()
  })

  afterEach(async () => {
    await dbHelper.clearDatabase()
  })

  afterAll(async () => {
    await dbHelper.closeDatabase()
  })

  it('should create a product', async () => {
    const product = await createProduct()
    expect(product).toHaveProperty('_id')
    expect(product).toHaveProperty('name', 'Chair')
    expect(product).toHaveProperty('description', 'Brown Chair')
  })

  it('should get a product with id', async () => {
    const product = await createProduct()
    const found = await ProductService.findById(product._id)
    expect(found.name).toEqual(product.name)
    expect(found._id).toEqual(product._id)
  })

  it('should not get a non-existing product', async () => {
    expect.assertions(1)
    return ProductService.findById(nonExistingProductId).catch((e) => {
      expect(e.message).toMatch(`Product ${nonExistingProductId} not found`)
    })
  })

  it('should update an existing product', async () => {
    const product = await createProduct()
    const update = {
      name: 'TV',
      description: '24 inches TV',
    }
    const updated = await ProductService.update(product._id, update)
    expect(updated).toHaveProperty('_id', product._id)
    expect(updated).toHaveProperty('name', 'TV')
  })

  it('should not update a non-existing product', async () => {
    expect.assertions(1)
    const update = {
      name: 'TV',
      description: '24 inches TV',
    }
    return ProductService.update(nonExistingProductId, update).catch((e) => {
      expect(e.message).toMatch(`Product ${nonExistingProductId} not found`)
    })
  })

  it('should delete an existing product', async () => {
    expect.assertions(1)
    const product = await createProduct()
    await ProductService.deleteProduct(product._id)
    return ProductService.findById(product._id).catch((e) => {
      expect(e.message).toMatch(`Product ${product._id} not found`)
    })
  })
})
