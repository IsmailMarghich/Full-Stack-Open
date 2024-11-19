const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert/strict')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

const initialUsers = [{
  'username': 'root',
  'name': 'Superuser',
  'password': 'salainen'
},
{
  'username': 'mluukai',
  'name': 'Matti Luukkainen',
  'password': 'salainen'
}
]

beforeEach(async () => {
  await User.deleteMany({})
  let blogObject = new User(initialUsers[0])
  await blogObject.save()
  blogObject = new User(initialUsers[1])
  await blogObject.save()
})

test('correct amount of users', async () => {
  const response = await api.get('/api/users')
  console.log(response.body)
  assert.strictEqual(response.body.length, 2)
})


test('succesfully post user', async () => {
  await api.post('/api/users').send({
    'username': 'Bobby',
    'name': 'Bob ross',
    'password': '123456'
  })

  const response = await api.get('/api/users')
  const users = response.body
  console.log(users)
  assert.strictEqual(users.length, initialUsers.length +1)
})

test('Return 400 when posting user without username', async () => {
  await api.post('/api/users').send({
    'name': 'Bob ross',
    'password': '123456'
  }
  ).expect(400)

  const response = await api.get('/api/users')
  const users = response.body
  assert.strictEqual(users.length, initialUsers.length)
}
)
test('Return 400 when posting user without password', async () => {
  await api.post('/api/users').send({
    'username': 'Bobby',
    'name': 'Bob ross',
  }
  ).expect(400)

  const response = await api.get('/api/users')
  const users = response.body
  assert.strictEqual(users.length, initialUsers.length)
}
)
test('Return 400 when username is too short', async () => {
  await api.post('/api/users').send({
    'username': 'Bo',
    'name': 'Bob ross',
    'password': '123456'
  })

  const response = await api.get('/api/users')
  const users = response.body
  console.log(users)
  assert.strictEqual(users.length, initialUsers.length)
})
test('Return 400 when password is too short', async () => {
  await api.post('/api/users').send({
    'username': 'Bob',
    'name': 'Bob ross',
    'password': '12'
  })

  const response = await api.get('/api/users')
  const users = response.body
  console.log(users)
  assert.strictEqual(users.length, initialUsers.length)
})
test('Return 400 when username is already taken', async () => {
  await api.post('/api/users').send({
    'username': 'root',
    'name': 'Bob ross',
    'password': '123'
  }).expect(400).expect('Content-Type', /application\/json/)


  const response = await api.get('/api/users')
  const users = response.body
  console.log(users)
  assert.strictEqual(users.length, initialUsers.length)
})
after(async () => {
  await mongoose.connection.close()
})