const { Sequelize, sequelize } = require('../init')

const Song = sequelize.define('songs', {
    name: {
        type: Sequelize.STRING, //约束字符串类型
        allowNull: false, //是否允许为空 (默认ture)
        unique: true
    },
    author: {
        type: Sequelize.STRING, //约束字符串类型
        allowNull: false //是否允许为空 (默认ture)
    },
    type: {
        type: Sequelize.STRING, //约束字符串类型
        allowNull: false //是否允许为空 (默认ture)
    }
})

//同步模型
Song.sync().then(() => {
    console.log('模型同步成功');
})

module.exports = Song;