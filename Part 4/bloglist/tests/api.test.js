const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert/strict')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [{
  title: 'Go To Statement Considered Harmful',
  author: 'Edsger W. Dijkstra',
  url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
  likes: 5
},
{ title: 'Canonical string reduction',
  author: 'Edsger W. Dijkstra',
  url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
  likes: 12 }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

test('correct amount of blogs', async () => {
  const response = await api.get('/api/blogs')
  console.log(response.body)
  assert.strictEqual(response.body.length, 2)
})

test('verify identifier of blogpost is named id', async() => {
  const response = await api.get('/api/blogs')
  const blogs = response.body
  blogs.forEach(blog => {
    assert(blog.id)
  })
})
test('succesfully post blog', async () => {
  await api.post('/api/blogs').send(
    { title: 'The case against CS master’s degrees',
      author: 'Oz',
      url: 'https://ozwrites.com/masters',
      likes: 6 }).expect(201).expect('Content-Type', /application\/json/
  )

  const response = await api.get('/api/blogs')
  const blogs = response.body
  console.log(blogs)
  assert.strictEqual(blogs.length, initialBlogs.length +1)
})
test('verify likes is set to zero when likes field is empty', async () => {
  await api.post('/api/blogs').send(
    { title: 'The case against CS master’s degrees',
      author: 'Oz',
      url: 'https://ozwrites.com/masters' }).expect(201).expect('Content-Type', /application\/json/
  )

  const response = await api.get('/api/blogs')
  const blogs = response.body
  console.log(blogs)
  assert.strictEqual(blogs.at(-1).likes, 0)
})
test('Return 400 when posting blog without title', async () => {
  await api.post('/api/blogs').send(
    {
      author: 'Oz',
      url: 'https://ozwrites.com/masters',
      likes: 6 }).expect(400)

  const response = await api.get('/api/blogs')
  const blogs = response.body
  assert.strictEqual(blogs.length, initialBlogs.length)
}
)
test('Return 400 when posting blog without url', async () => {
  await api.post('/api/blogs').send(
    { title: 'The case against CS master’s degrees',
      author: 'Oz',
      likes: 6 }).expect(400)

  const response = await api.get('/api/blogs')
  const blogs = response.body
  assert.strictEqual(blogs.length, initialBlogs.length)
}
)
test('Delete a blog post', async() => {
  const initialResponse = await api.get('/api/blogs')
  const deleteId = initialResponse.body[0].id
  await api.delete(`/api/blogs/${deleteId}`)
  const response = await api.get('/api/blogs')
  const blogs = response.body
  assert.strictEqual(blogs.length, initialBlogs.length - 1)
})
test('Update a blog post', async() => {
  const initialResponse = await api.get('/api/blogs')
  const updateId = initialResponse.body[0].id
  const updatedBlog = {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 6
  }
  await api.put(`/api/blogs/${updateId}`).send(updatedBlog)

  const response = await api.get('/api/blogs')
  const blogs = response.body
  assert.strictEqual(blogs[0].likes, updatedBlog.likes)
})
after(async () => {
  await mongoose.connection.close()
})