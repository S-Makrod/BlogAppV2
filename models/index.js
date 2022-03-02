const Blog = require('./blog')
const User = require('./user')
const UserBlogs = require('./user_blogs')
const Comment = require('./comment')

User.sync({ alter: true })
Blog.sync({ alter: true })
UserBlogs.sync({ alter: true })
Comment.sync({ alter: true })

User.hasMany(Blog, {onDelete: 'cascade'})
Blog.belongsTo(User)

User.hasMany(Comment, {onDelete: 'cascade'})
Comment.belongsTo(User)
Blog.hasMany(Comment, {onDelete: 'cascade'})
Comment.belongsTo(Blog)

User.belongsToMany(Blog, { through: UserBlogs, as: 'readings' })
Blog.belongsToMany(User, { through: UserBlogs, as: 'users_marked' })

module.exports = {
    Blog, User, UserBlogs, Comment
}