var fs = require('fs')
var http = require('http')
var url = require('url')
let multer = require('multer')
const User = require('./database/model/User')
const songs = require('./database/model/songs')
const List = require('./database/model/list')
const jwt = require('jsonwebtoken')
const storage = require('node-sessionstorage')

require('./database/init')
var db = './public/js/db.json'
var comment = './public/js/comments.json'
var ls = './public/js/songs.json'
var upload = multer({ dest: './public/upload' })

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
        } else if (currentUrl.indexOf('/public') == 0) {
            if (currentUrl.includes('/css')) {
                res.setHeader('content-Type', 'text/css;charset=utf-8')
            }
            if (currentUrl.includes('/img')) {
                res.setHeader('content-Type', 'text/.jpg;charset=utf-8')
            }
            fs.readFile('./' + currentUrl, (err, data) => {
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
                    res.writeHead(200, {
                        'content-type': 'text/html;charset=utf8'
                    });
                    console.log('用户名已存在');
                    // res.send({ msg: '用户名已存在' })
                    res.statusCode = 400
                    res.end("<h1>用户名已存在</h1><a href='http://localhost:3000/#register'>返回</a>")
                    return
                }
                const user = await User.create({ username, password })
                console.log('注册成功');
                console.log(user.dataValues);
                // res.send({ msg: '注册成功' })
                res.statusCode = 302
                res.setHeader('Location', '/')
                res.end()
            }
        } else if (currentUrl.indexOf('/dologin') == 0) {
            const { username, password } = url.parse(req.url, true).query
            console.log('输入的用户名：', username)
            const model = await User.findOne({ where: { username } })
            if (!model) {
                res.writeHead(200, {
                    'content-type': 'text/html;charset=utf8'
                });
                console.log('此用户名不存在');
                // res.send({ msg: '此用户名不存在' })
                res.statusCode = 400
                res.end("<h1>此用户名不存在</h1><a href='http://localhost:3000/#login'>返回</a>")
                return
            }
            if (password != model.password) {
                res.writeHead(200, {
                    'content-type': 'text/html;charset=utf8'
                });
                console.log('密码错误');
                // res.send({ msg: '密码错误' })
                res.statusCode = 400
                res.end("<h1>密码错误</h1><a href='http://localhost:3000/#login'>返回</a>")
                return
            }
            const token = jwt.sign({ username }, 'xxoo')
            storage.setItem('token', token);
            res.statusCode = 302
            res.setHeader('Location', '/Home')
            res.end()
        } else if (currentUrl.indexOf('/Home') == 0) {
            const token = storage.getItem('token')
            if (token == null) {
                console.log('token无效')
                res.statusCode = 302
                res.setHeader('Location', '/')
                return
            }
            const { username } = jwt.verify(token, 'xxoo')
            const model = await User.findOne({ where: { username } })
            if (!model) {
                console.log('请注册')
                return
            }
            console.log('身份校验成功')
            fs.readFile('./views/首页.html', 'utf8', (err, data) => {
                if (err) {
                    res.end('出错');
                    return
                }
                res.setHeader('content-Type', 'text/html;charset=utf-8');
                res.write(data);
                res.end()
            })
        } else if (currentUrl.indexOf('/list') == 0) {
            const allsong = await List.findAll()
                // for (var i = 0; i < allsong.length; i++) {
                //     console.log(allsong[i].dataValues.name)
                // }
            fs.readFile(ls, function(err, data) {
                if (err) {
                    console.log("json 文件读取失败");
                }
                var ary = []
                for (var i = 0; i < allsong.length; i++) {
                    var arr = {
                        id: allsong[i].dataValues.id,
                        name: allsong[i].dataValues.name,
                        author: allsong[i].dataValues.author,
                        type: allsong[i].dataValues.type,
                        link: allsong[i].dataValues.link,
                    }
                    ary.push(arr)
                }
                ary = JSON.stringify(ary)
                fs.writeFile(ls, ary, function(err) {
                    if (err) {
                        console.log('写入失败')
                    }
                    res.end()
                })
                res.end()
            })
        } else if (currentUrl.indexOf('/db.json') == 0) {
            fs.readFile(db, function(err, data) {
                if (err) {
                    console.log("json 文件读取失败");
                }
                console.log(data)
                res.end()
            })
        } else if (currentUrl.indexOf('/recommend') == 0) {
            const token = storage.getItem('token')
            const { username } = jwt.verify(token, 'xxoo')
            const model = await User.findOne({ where: { username } })
            if (!model) {
                console.log('请登录')
                return
            } else {
                fs.readFile('./views/歌单.html', 'utf8', (err, data) => {
                    if (err) {
                        res.end('出错');
                        return
                    }
                    res.setHeader('content-Type', 'text/html;charset=utf-8');
                    res.write(data);
                    res.end()
                })
            }
        } else if (currentUrl.indexOf('/addsong') == 0) {
            var str = ''
                // 1.1 需要用data方法去读取数据
            req.on('data', (chunk) => {
                    str += chunk
                })
                // 1.2 当end事件完成后才能拿到并处理数据
            req.on('end', () => {
                // console.log(str)
                // 1.3 querystring方法处理数据
                var obj = str.split(",")
                ddd(req, res, obj)
                songs.create({ name: obj[0], author: obj[1], type: obj[2], link: obj[3] })
            })

            function ddd(req, res, obj) {
                fs.readFile(db, function(err, data) {
                    if (err) {
                        console.log("json 文件读取失败");
                    }
                    console.log(obj)
                    var all = JSON.parse(data)
                    var ary = []
                    for (var i in all) {
                        ary.push(all[i])
                    }
                    var arr = {
                            name: obj[0],
                            author: obj[1],
                            type: obj[2],
                        }
                        // all.pusu(arr)
                    console.log(typeof(ary))
                    ary.push(arr)
                    console.log(ary)
                    ary = JSON.stringify(ary)
                    fs.writeFile(db, ary, function(err) {
                        if (err) {
                            console.log('写入失败')
                        }
                        res.end()
                    })
                    res.end()
                })
            }
        } else if (currentUrl.indexOf('/printsong') == 0) {
            const allsong = await songs.findAll()
                // for (var i = 0; i < allsong.length; i++) {
                //     console.log(allsong[i].dataValues.name)
                // }
            fs.readFile(db, function(err, data) {
                if (err) {
                    console.log("json 文件读取失败");
                }
                var ary = []
                for (var i = 0; i < allsong.length; i++) {
                    var arr = {
                        name: allsong[i].dataValues.name,
                        author: allsong[i].dataValues.author,
                        type: allsong[i].dataValues.type,
                    }
                    ary.push(arr)
                }
                ary = JSON.stringify(ary)
                fs.writeFile(db, ary, function(err) {
                    if (err) {
                        console.log('写入失败')
                    }
                    res.end()
                })
                res.end()
            })
        } else if (currentUrl.indexOf('/removesong') == 0) {
            var str = ''
                // 1.1 需要用data方法去读取数据
            req.on('data', (chunk) => {
                    str += chunk
                })
                // 1.2 当end事件完成后才能拿到并处理数据
            req.on('end', () => {
                // console.log(str)
                // 1.3 querystring方法处理数据
                str = str.split(",")
                var name = str[1]
                    // rrr(req, res, str[0])
                songs.destroy({ where: { name } })
            })

            function rrr(req, res, str) {
                fs.readFile(db, function(err, data) {
                    if (err) {
                        console.log("json 文件读取失败");
                    }
                    console.log(str)
                    var all = JSON.parse(data)
                    var ary = []
                    for (var i in all) {
                        ary.push(all[i])
                    }
                    console.log(ary)

                    ary.splice(str, 1)
                    ary = JSON.stringify(ary)
                    fs.writeFile(db, ary, function(err) {
                        if (err) {
                            console.log('写入失败')
                        }
                        res.end()
                    })
                    res.end()
                })
            }
        } else if (currentUrl.indexOf('/clearAll') == 0) {
            fs.readFile(db, function(err, data) {
                if (err) {
                    console.log("json 文件读取失败");
                }
                console.log(str)
                var ary = []
                ary = JSON.stringify(ary)
                fs.writeFile(db, ary, function(err) {
                    if (err) {
                        console.log('写入失败')
                    }
                    res.end()
                })
                res.end()
            })
        } else if (currentUrl.indexOf('/comments') == 0) {
            var str = ''
                // 1.1 需要用data方法去读取数据
            req.on('data', (chunk) => {
                    str += chunk
                })
                // 1.2 当end事件完成后才能拿到并处理数据
            req.on('end', () => {
                // console.log(str)
                // 1.3 querystring方法处理数据 
                writecomments(req, res, str)
            })

            function writecomments(req, res, str) {
                fs.readFile(comment, function(err, data) {
                    if (err) {
                        console.log("json 文件读取失败");
                    }
                    var all = JSON.parse(data)
                    var arr = { comment: str }
                    all.push(arr)
                    all = JSON.stringify(all)
                    fs.writeFile(comment, all, function(err) {
                        if (err) {
                            console.log('写入失败')
                        }
                        res.end()
                    })
                    res.end()
                })
            }
        } else if (currentUrl.indexOf('/comments.json') == 0) {
            fs.readFile(comment, function(err, data) {
                if (err) {
                    console.log("json 文件读取失败");
                }
                console.log(data)
                res.end()
            })
        } else if (currentUrl.indexOf('/removecomment') == 0) {
            var str = ''
                // 1.1 需要用data方法去读取数据
            req.on('data', (chunk) => {
                    str += chunk
                })
                // 1.2 当end事件完成后才能拿到并处理数据
            req.on('end', () => {
                // console.log(str)
                // 1.3 querystring方法处理数据 
                str = str - 1
                deletecomment(req, res, str)
            })

            function deletecomment(req, res, str) {
                fs.readFile(comment, function(err, data) {
                    if (err) {
                        console.log("json 文件读取失败");
                    }
                    var all = JSON.parse(data)
                    var ary = []
                    for (var i in all) {
                        ary.push(all[i])
                    }
                    ary.splice(str, 1)
                    ary = JSON.stringify(ary)
                    fs.writeFile(comment, ary, function(err) {
                        if (err) {
                            console.log('写入失败')
                        }
                        res.end()
                    })
                    res.end()
                })
            }
        } else if (currentUrl.indexOf('/userpofile') == 0) {
            const token = storage.getItem('token')
            const { username } = jwt.verify(token, 'xxoo')
            const model = await User.findOne({ where: { username } })
            if (!model) {
                console.log('请登录')
                res.end('请登录');
                return
            } else {
                fs.readFile('./views/个人资料.html', 'utf8', (err, data) => {
                    if (err) {
                        res.end('出错');
                        return
                    }
                    res.setHeader('content-Type', 'text/html;charset=utf-8');
                    res.write(data);
                    res.end()
                })
            }
        }
    })
    .listen(3000, () => {
        console.log('启动成功 访问http://localhost:3000/');
    })