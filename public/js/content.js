// const { Json } = require("sequelize/types/lib/utils");

var content = document.getElementById('content')
var playing = document.getElementById('playing')
var aubox = document.getElementById('aubox')
var deletesong = document.getElementsByClassName('deletesong')
var str1;
var str2;
var x = 5
var r = 4

function writedata() {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            getdata1()
        }
    }
    xhr.open('get', '/printsong')
    xhr.send(null)
}

function getdata1() {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            // alert(xhr.responseText)
            str1 = xhr.responseText
        }
        ing(str1, playing)
    }
    xhr.open('get', 'http://localhost:3000/public/js/db.json')
    xhr.send(null)
}

function listdata() {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            getdata2()
        }
    }
    xhr.open('get', '/list')
    xhr.send(null)
}

function getdata2() {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            // alert(xhr.responseText)
            str2 = xhr.responseText
        }
        output(str2, content)
    }
    xhr.open('get', 'http://localhost:3000/public/js/songs.json')
    xhr.send(null)
}

function output(str, content) {

    var data = JSON.parse(str);
    for (var i = 0; i < data.length; i++) {
        content.innerHTML = content.innerHTML +
            `<li id="type">
            <div>${data[i].name}</div>
            <div>${data[i].author}</div>
            <div class="type">${data[i].type}</div>
            <div id="dock" title="加入播放列表" class="dock fa fa-plus" onclick="addinfo(this,playing,aubox);post(this)" data-index=${data[i].name},${data[i].author},${data[i].type},${data[i].link}></div>
            </li>`
    }
}

function ing(str, playing) {
    var data = JSON.parse(str);
    for (var i = 0; i < data.length; i++) {
        playing.innerHTML = playing.innerHTML +
            `<div>
        <div>${data[i].name}</div>
        <div>${data[i].type}</div>
        <div>${data[i].author}</div>
        <a onclick="removeinfo(this,deletesong)" data-index="${data[i].name}" class="deletesong fa fa-trash-o"></a>
    </div>`
    }
}

function addinfo(it, playing, aubox) {
    var pointindex = it.getAttribute('data-index');
    index = pointindex;
    var v = index.split(",")
        // console.log(content.innerHTML)
    var mmmm1 = document.createElement('div')
    var mmmm2 = document.createElement('div')
    var mmmm3 = document.createElement('div')
    var mmmm4 = document.createElement('div')
    var mmmm5 = document.createElement('a')
    mmmm2.innerHTML = `${v[0]}`
    mmmm3.innerHTML = `${v[1]}`
    mmmm4.innerHTML = `${v[2]}`
    mmmm5.setAttribute("onclick", "removeinfo(this)")
    mmmm5.setAttribute("data-index", `${r+1}`)
    mmmm5.setAttribute("class", "deletesong fa fa-trash-o")
    mmmm1.append(mmmm2)
    mmmm1.append(mmmm3)
    mmmm1.append(mmmm4)
    mmmm1.append(mmmm5)
    playing.append(mmmm1)
    r++
    aubox.innerHTML = aubox.innerHTML +
        `<div id="vessel${x}" class="vessel molecu">
            <audio src="${v[3]}" controls="controls" id="play${x}" class="wc">
            </audio>
            </div>`
    x++
}

function getArrayIndex(arr, obj) {
    var i = arr.length;
    while (i--) {
        if (arr[i] === obj) {
            return i;
        }
    }
    return -1;
}

function removeinfo(it) {
    console.log(it)
    var child = playing.children
    var index = getArrayIndex(child, it.parentNode)
    var name = it.getAttribute('data-index')
    var parem = [index, name]
    playing.removeChild(child[index])
    var xh = new XMLHttpRequest();
    xh.open('post', '/removesong', true)
    xh.send(parem)
    xh.onreadystatechange = function() {}
}

function clearAll() {
    var xhr = new XMLHttpRequest();
    xhr.open('post', '/clearAll', true)
    xhr.send()
    xhr.onreadystatechange = function() {}
    var child = playing.children
    var length = child.length + 1
    for (var t = 0; t < length; t++) {
        playing.removeChild(child[1])
    }
}

function choice(it) {
    if (it == 'null') {
        for (var jk = 1; jk < content.children.length; jk++) {
            content.children[jk].style.display = "block"
        }
        return
    }
    for (var jk = 1; jk < content.children.length; jk++) {
        content.children[jk].style.display = "block"
    }

    for (var jk = 1; jk < content.children.length; jk++) {
        var type = content.children[jk].children[2].innerHTML
        if (type != it) {
            content.children[jk].style.display = "none"
        }
    }
}

function post(it) {
    var str = it.getAttribute("data-index")
    var data = str.split(",")
    ajax({
        type: 'post',
        url: '/addsong',
        data: {
            name: data[0],
            author: data[1],
            type: data[2],
            link: data[3]
        },
        success: function(data) {
            // console.log(data)
        }
    })
}

function ajax(option) {

    var xhr = new XMLHttpRequest();
    var params = " "
    params = [option.data.name, option.data.author, option.data.type, option.data.link]
        // console.log(params)
        // x-www-form-urlencoded
    xhr.open(option.type, option.url, true)
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(params)
    xhr.onreadystatechange = function() {
        option.success(xhr.responseText)
    }
}

window.onload = function() {
    writedata();
    listdata()
}