function hashchanged() {
    var h = location.hash;
    var p = document.getElementById('mplayer');

    if (h == '#play') {
        p.controls.play();
    } else if (h == '#pause') {
        p.controls.stop();
    }
}

document.addEventListener('DOMContentLoaded', function () {
    window.onhashchange = hashchanged;
});

