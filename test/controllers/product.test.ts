import request from 'supertest'

import Product, { ProductDocument } from '../../src/models/Product'
import app from '../../src/app'
import * as dbHelper from '../db-helper'

const nonExistingMovieId = '603eae50965e8f05f016d6c1'

async function createProduct(override?: Partial<ProductDocument>) {
  let product = {
    name: 'Chair',
    description: 'Brown Chair',
    categories: 'Furniture',
    variant: 'variant',
    sizes: 'big',
  }

  if (override) {
    product = { ...product, ...override }
  }

  return await request(app).post('/api/v1/products').send(product)
}

describe('product controller', () => {
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
    const res = await createProduct()
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('_id')
    expect(res.body.name).toBe('Chair')
  })

  it('should not create a product with wrong data', async () => {
    const res = await request(app).post('/api/v1/products').send({
      // name: 'Table',
      description: 'Brown Table',
      categories: 'Furniture',
      variant: 'variant',
      sizes: 'big',
    })

    expect(res.status).toBe(400)
  })

  it('schould get back an existing product', async () => {
    let res = await createProduct()
    expect(res.status).toBe(200)

    const productId = res.body._id
    res = await request(app).get(`/api/v1/products/${productId}`)

    expect(res.body._id).toEqual(productId)
    expect(res.body.name).toBe('Chair')
  })

  it('should not get back a non-existing product', async () => {
    const res = await request(app).get(`/api/v1/products/${nonExistingMovieId}`)
    expect(res.status).toBe(404)
  })

  it('should get back all products', async () => {
    const res1 = await createProduct({
      name: 'Bookshelve',
      description: 'Tall bookshelve',
    })

    const res2 = await createProduct({
      name: 'TV',
      description: '24 inches TV',
    })

    const res3 = await request(app).get('/api/v1/products')

    expect(res3.body.length).toEqual(2)
    expect(res3.body[0]._id).toEqual(res1.body._id)
    expect(res3.body[1].name).toEqual(res2.body.name)
  })

  it('should update an existing product', async () => {
    let res = await createProduct()
    expect(res.status).toBe(200)

    const productId = res.body._id
    const update = {
      name: 'TV',
      description: '24 inches TV',
    }

    res = await request(app).put(`/api/v1/products/${productId}`).send(update)

    expect(res.status).toBe(200)
    expect(res.body.name).toEqual('TV')
    expect(res.body.description).toEqual('24 inches TV')
  })

  it('should delete an existing product', async () => {
    let res = await createProduct()
    expect(res.status).toBe(200)
    const productId = res.body._id

    res = await request(app).delete(`/api/v1/products/${productId}`)
    expect(res.status).toBe(204)

    res = await request(app).get(`/api/v1/products/${productId}`)
    expect(res.status).toBe(404)
  })
})
