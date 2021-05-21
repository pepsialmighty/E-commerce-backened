import { findById } from './../../src/controllers/movie'
import { updateUser } from './../../src/controllers/user'
import User from '../../src/models/User'
import UserService from '../../src/services/user'
import * as dbHelper from '../db-helper'
import product from '../../src/services/product'

const nonExistingUserId = '603eae50965e8f05f016d6c1'

async function signUpNewUser() {
  const user = new User({
    username: 'Pepsi',
    password: '1234',
    email: 'pepsi@gmail.com',
  })

  return await UserService.signUpNewUser(user)
}

describe('user service', () => {
  beforeEach(async () => {
    await dbHelper.connect()
  })

  afterEach(async () => {
    await dbHelper.clearDatabase()
  })

  afterAll(async () => {
    await dbHelper.closeDatabase()
  })

  it('should create new user', async () => {
    const user = await signUpNewUser()
    expect(user).toHaveProperty('_id')
    expect(user).toHaveProperty('username', 'Pepsi')
    expect(user).toHaveProperty('password', '1234')
  })

  it('should update an existing user', async () => {
    const user = await signUpNewUser()
    const update = {
      username: 'John',
      email: 'john@gmail.com',
    }
    const updated = await UserService.updateUserProfile(user._id, update)
    expect(updated).toHaveProperty('_id', user._id)
    expect(updated).toHaveProperty('username', 'John')
  })

  it('should not update non-existing user', () => {
    expect.assertions(1)
    const update = {
      username: 'John',
      email: 'john@gmail.com',
    }
    return UserService.updateUserProfile(nonExistingUserId, update).catch(
      (e) => {
        expect(e.message).toMatch(`User ${nonExistingUserId} not found`)
      }
    )
  })

  it('should delete an existing user', async () => {
    expect.assertions(1)
    const user = await signUpNewUser()
    await UserService.deleteUser(user._id)
    return UserService.findById(user._id).catch((e) => {
      expect(e.message).toMatch(`User ${user._id} not found`)
    })
  })
})
