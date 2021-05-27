var pp = document.getElementById('play/pause')
    // var vessel1 = document.getElementById('vessel1')
    // var vessel2 = document.getElementById('vessel2')
    // var vessel3 = document.getElementById('vessel3')
    // var vessel4 = document.getElementById('vessel4')
var wc = document.getElementsByClassName('wc')
var molecu = document.getElementsByClassName('molecu')
var off = 1
var k = 0
    // var vessel = [vessel1, vessel2, vessel3, vessel4]


function fff() {
    if (off) {
        wc[k].play()
        off = !off
    } else {
        wc[k].pause()
        off = !off
    }
    console.log(wc)
}

function next() {
    if (k == wc.length - 1) {
        wc[k].pause()
        wc[k].load()
        molecu[k].className = "vessel molecu"
        k = 0
        molecu[k].className = "active molecu"
        wc[k].play()
        off = 0
        return
    }
    wc[k].pause()
    wc[k].load()
    molecu[k].className = "vessel molecu"
    k++
    off = 1
    molecu[k].className = "active molecu"
    fff()


}

function pre() {
    if (k == 0) {
        wc[k].pause()
        wc[k].load()
        molecu[k].className = "vessel molecu"
        k = wc.length - 1
        molecu[k].className = "active molecu"
        wc[k].play()
        off = 0
        return
    }
    wc[k].pause()
    wc[k].load()
    molecu[k].className = "vessel molecu"
    k--
    off = 1
    molecu[k].className = "active molecu"
    fff()

}