var fs = require('fs')
var http = require('http')
var url = require('url')
const User = require('./database/model/User')

require('./database/init')

http
    .createServer(async(req, res) => {
        var currentUrl = req.url;
        if (currentUrl == '/') {
            fs.readFile('./views/QGmusic.html', 'utf8', (err, data) => {
                if (err) {
                    res.end('出错');
                }
                res.setHeader('content-Type', 'text/html;charset=utf-8');
                res.write(data);
                res.end();
            })
        } else if (currentUrl == '/register') {
            fs.readFile('./views/register.html', 'utf8', (err, data) => {
                if (err) {
                    res.end('出错');
                }
                res.setHeader('content-Type', 'text/html;charset=utf-8');
                res.write(data);
                res.end();
            })
        } else if (currentUrl.indexOf('/public') === 0) {
            if (currentUrl.includes('/css')) {
                res.setHeader('content-Type', 'text/css;charset=utf-8')
            }
            fs.readFile('./' + currentUrl, 'utf8', (err, data) => {
                if (err) {
                    res.end('出错');
                }
                res.write(data);
                res.end();
            })
        } else if (currentUrl.indexOf('/doregister') == 0) {
            if (req.method == 'POST') {

            } else {
                const { username, password } = url.parse(req.url, true).query
                console.log('用户名：', username)
                const model = await User.findOne({ where: { username } })
                if (model) {
                    console.log('用户名已存');
                    res.statusCode = 302
                    res.setHeader('Location', '/')
                    res.end()
                    return
                }
                const user = await User.create({ username, password })
                console.log('注册成功');
                console.log(user.dataValues);
                res.statusCode = 302
                res.setHeader('Location', '/')
                res.end()
            }
        }
    })

.listen(3000, () => {
    console.log('启动成功 访问http://localhost:3000/');
})