import request from 'supertest'

import User, { UserDocument } from '../../src/models/User'
import app from '../../src/app'
import * as dbHelper from '../db-helper'

async function signUpNewUser(override?: Partial<UserDocument>) {
  let user = {
    username: 'Pepsi',
    password: '1234',
    email: 'pepsi@gmail.com',
  }

  if (override) {
    user = { ...user, ...override }
  }

  return await request(app).post('/api/v1/users').send(user)
}

describe('user controller', () => {
  beforeEach(async () => {
    await dbHelper.connect()
  })

  afterEach(async () => {
    await dbHelper.clearDatabase()
  })

  afterAll(async () => {
    await dbHelper.closeDatabase()
  })

  it('should create a user', async () => {
    const res = await signUpNewUser()
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('_id')
    expect(res.body.username).toBe('Pepsi')
  })

  it('should get all the user', async () => {
    const res1 = await signUpNewUser({
      username: 'Pepsi',
      password: '1234',
    })

    const res2 = await signUpNewUser({
      username: 'Minh',
      password: '1234',
    })

    const res3 = await request(app).get('/api/v1/users')

    expect(res3.body.length).toEqual(2)
    expect(res3.body[0].username).toEqual(res1.body.username)
    expect(res3.body[1].password).toEqual(res1.body.password)
  })

  it('should update an existing user', async () => {
    let res = await signUpNewUser()
    expect(res.status).toBe(200)

    const userId = res.body._id
    const update = {
      username: 'John',
      email: 'john@gmail.com',
    }

    res = await request(app).put(`/api/v1/users/${userId}`).send(update)

    expect(res.status).toBe(200)
    expect(res.body.username).toEqual('John')
    expect(res.body.email).toEqual('john@gmail.com')
  })

  it('should delete an existing product', async () => {
    let res = await signUpNewUser()
    expect(res.status).toBe(200)
    const userId = res.body._id

    res = await request(app).delete(`/api/v1/users/${userId}`)
    expect(res.status).toBe(204)

    res = await request(app).get(`/api/v1/users/${userId}`)
    expect(res.status).toBe(404)
  })
})
