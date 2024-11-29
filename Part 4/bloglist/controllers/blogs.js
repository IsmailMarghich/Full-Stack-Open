const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = request.user
  console.log(user)
  if(!body.title){
    return response.status(400).end()
  }
  if(!body.url){
    return response.status(400).end()
  }
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
  console.log(request.token)
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const blog = await Blog.findById(request.params.id)
  if ( blog.user.toString() === decodedToken.id.toString() ) {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  }else {
    return response.status(401).json({ error: 'username invalid' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id,request.body,{ new: true })
  response.json(updatedBlog)
})
module.exports = blogsRouter