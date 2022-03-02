const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../utils/db')

class Comment extends Model {}
Comment.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: false,
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
    timestamps: true,
    modelName: 'comment'
})

module.exports = Comment