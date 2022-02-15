var pofile = document.getElementById('pofile')
var userpofilelist = document.getElementById('userpofilelist')
var on = 1

function userpo() {
    if (on) {
        userpofilelist.style.display = "block"
        on = !on
        console.log('123')
    } else {
        userpofilelist.style.display = "none"
        on = !on
    }
}