var list = document.getElementById('list')
var playlist = document.getElementById('playlist')
var on = 1;

function musiclist() {
    if (on) {
        playlist.className = "playlist-1"
        on = !on
    } else {
        playlist.className = "playlist-2"
        on = !on
    }
}