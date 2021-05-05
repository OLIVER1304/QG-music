const { Sequelize, sequelize } = require('../init')

const User = sequelize.define('users', {
    username: {
        type: Sequelize.STRING, //约束字符串类型
        allowNull: false, //是否允许为空 (默认ture)
        unique: true
    },
    password: {
        type: Sequelize.STRING, //约束字符串类型
        allowNull: false //是否允许为空 (默认ture)
    }
})

//同步模型
User.sync().then(() => {
    console.log('模型同步成功');
})

module.exports = User;