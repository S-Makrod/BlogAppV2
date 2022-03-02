const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../utils/db')

class UserBlogs extends Model {}

UserBlogs.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
    },
    blogId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'blogs', key: 'id' },
    },
    }, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'user_blogs'
})

module.exports = UserBlogs