
const totalLikes = (blogs) => {

  return blogs.reduce((likes, blog) => likes + blog.likes,0)
}

const favoriteBlog = (blogs) => {
  const favorite = blogs.reduce((favorite, blog) => {
    return (favorite.likes > blog.likes) ? favorite : blog
  })

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
}

const mostBlogs = (blogs) => {
  const authorBlogCount = blogs.reduce((count, blog) => {
    count[blog.author] = (count[blog.author] || 0) + 1
    return count
  }, {})

  const topAuthor = Object.keys(authorBlogCount).reduce((top, author) => {
    return (authorBlogCount[author] > authorBlogCount[top]) ? author : top
  })

  return {
    author: topAuthor,
    blogs: authorBlogCount[topAuthor]
  }

}
const mostLikes = (blogs) => {
  const authorLikeCount = blogs.reduce((count, blog) => {
    count[blog.author] = (count[blog.author] || 0) + blog.likes
    return count
  }, {})

  const topAuthor = Object.keys(authorLikeCount).reduce((top, author) => {
    return (authorLikeCount[author] > authorLikeCount[top]) ? author : top
  })

  return {
    author: topAuthor,
    likes: authorLikeCount[topAuthor]
  }

}
module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}