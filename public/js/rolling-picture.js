var items = document.getElementsByClassName('item');
var point = document.getElementsByClassName('point');
var goprebtn = document.getElementById('gopre');
var gonextbtn = document.getElementById('gonext');
var itemactive = document.getElementsByClassName("item active")
var brp = document.getElementsByClassName("brp")
var index = 0;
var clearactive = function() {
    for (var i = 0; i < items.length; i++) {
        items[i].className = 'item';
    }
    for (var i = 0; i < point.length; i++) {
        point[i].className = 'point';
    }
}

var goindex = function() {
    clearactive();
    point[index].className = 'point active';
    items[index].className = 'item active';
    gobrp()
}

var gobrp = function() {
    // console.log(itemactive[0].src)
    var blink = itemactive[0].src
    brp[0].src = blink
}

var gonext = function() {
    if (index < 5) {
        index++;
    } else {
        index = 0;
    }
    goindex();
    gobrp()
}
var gopre = function() {
    if (index > 0) {
        index--;
    } else {
        index = 5;
    }
    goindex();
    gobrp()
}
for (var i = 0; i < point.length; i++) {
    point[i].addEventListener('click', function() {
        var pointindex = this.getAttribute('data-index');
        index = pointindex;
        goindex();
    })
}