// const { literal } = require("sequelize/types");

var maxstrlen = 160;

function Q(o) {
    return document.getElementById(o);
}

function checkWord(w) {
    len = maxstrlen;
    var str = w.value;
    myLen = getStrleng(str);
    var wck = Q("wordChecks");
    if (myLen > len * 2) {
        w.value = str.substring(0, i + 1);
    } else {
        wck.innerHTML = Math.floor((len * 2 - myLen) / 2);
    }
}

function getStrleng(str) {
    var i = 0;
    myLen = 0;
    for (;
        (i < str.length) && (myLen <= maxstrlen * 2); i++) {
        if (str.charCodeAt(i) > 0 && str.charCodeAt(i) < 128) //字符编码，128以内的是数字，英文字符，已经英文的符号等
            myLen++;
        else
            myLen += 2;
    }
    return myLen;
}
var ts = function() {
    var i = document.getElementById('wordChecks');
    if (i.length > 160) {
        alert(zishuchaoguo);
    } else {
        return true;
    }
}

var cmt = document.getElementById('cmt');
var cl = document.getElementById('c-l');
var ta = document.getElementById('ta');
cmt.onclick = function() {
    var tatx = ta.value;
    if (tatx == "" || tatx == null) {
        alert("评论为空");
        return false
    } else {
        var l = document.createElement('li')
        l.innerHTML = `<div class="u-com">
        <div class="head">
            <img src="" alt="">
        </div>
        <div class="cntwrap">
            <div>${tatx} </div>
            <div class="rp">
                <a class="reply" href="javascript:void(0)">回复</a>
                <span>|</span>
                <a class="reply" href="javascript:void(0)" onclick="removecomment(this)">删除</a>
                <a href=""></a>
            </div>
        </div>
    </div>
    <div>`
        cl.append(l)
    }
    var xh = new XMLHttpRequest();
    xh.open('post', '/comments', true)
    xh.send(tatx)
    xh.onreadystatechange = function() {}
}



var reply = document.getElementById('reply');
var mquk = document.getElementById('m-quk');
var show = true;
reply.onclick = function() {
    if (show) {
        mquk.style.display = 'block';
    } else {
        mquk.style.display = 'none';
    }
    show = !show
}

var cl = document.getElementById('c-l')
var str;

function getcomment() {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            // alert(xhr.responseText)
            str = xhr.responseText
        }
        output(str, cl)
    }
    xhr.open('get', 'http://localhost:3000/public/js/comments.json')
    xhr.send(null)
}

function output(str, cl) {
    var data = JSON.parse(str);
    for (var i = 0; i < data.length; i++) {
        var l = document.createElement('li')
        l.innerHTML = `<div class="u-com">
        <div class="head">
            <img src="" alt="">
        </div>
        <div class="cntwrap">
            <div>${data[i].comment} </div>
            <div class="rp">
                <a class="reply" href="javascript:void(0)">回复</a>
                <span>|</span>
                <a class="reply" href="javascript:void(0)" onclick="removecomment(this)">删除</a>
                <a href=""></a>
            </div>
        </div>
    </div>
    <div>`
        cl.append(l)
    }
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

function removecomment(it) {
    var io = it.parentNode.parentNode.parentNode.parentNode
    var index = getArrayIndex(cl.children, io)
    var cd = cl.children
    cl.removeChild(cd[index])
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {}
    }
    xhr.open('post', '/removecomment')
    xhr.send(index)
}

window.onload = function() {
    var p1 = document.getElementsByClassName('p1-1')[0];
    var p2 = document.getElementsByClassName('p1-2')[0];
    var cnt5 = document.getElementById('cnt5');
    var a = cnt5.getElementsByTagName('a')[0];
    var oopen = true;
    a.onclick = function() {
        if (oopen == true) {
            p1.className = 'p2-1';
            p2.className = 'p2-2';
            a.innerHTML = '收起';
        } else {
            p1.className = 'p1-1';
            p2.className = 'p1-2';
            a.innerHTML = '展开';
        }
        oopen = !oopen;
    }
    getcomment()
}