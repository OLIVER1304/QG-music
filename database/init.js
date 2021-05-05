const Sequelize = require('sequelize') //引入sequelize模块

const sequelize = new Sequelize('users', 'root', '119704887', {
        host: 'localhost', //地址
        dialect: 'mysql', //指定数据库类型(必须)
        port: '3306' //默认端口号3306
    })
    //连接
sequelize
    .authenticate()
    .then(() => {
        console.log('数据库连接成功');
    })
    .catch(err => {
        console.error('连接失败' + '错误信息' + err);
    });

module.exports = { Sequelize, sequelize } //导出(创建模型需要)