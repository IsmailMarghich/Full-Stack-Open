const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)

})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  if(!body.title){
    return response.status(400).end()
  }
  if(!body.url){
    return response.status(400).end()
  }

  const user = await User.findById(body.userId)
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id
  })

  user.blogs = user.blogs.concat(blog._id)
  await user.save()
  const result = await blog.save()
  response.status(201).json(result)

})

blogsRouter.delete('/:id', async(request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()

})

blogsRouter.put('/:id', async (request, response) => {
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id,request.body,{ new: true })
  response.json(updatedBlog)
})
module.exports = blogsRouter