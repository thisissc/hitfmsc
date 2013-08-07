console.log = function() {}

var parent_url = 'chrome-extension://ldihbnchbmhhcbffhkgccdgnmidehgoc/background.html';
var state_interval_id = null;
var last_pos = 0;
var player = null;

function play() {
    onplaying();

    if (player.controls == undefined) {
        player.play();
    } else {
        player.controls.play();
    }

    window.clearInterval(state_interval_id);
    checkstate();
}

function pause() {
    onpaused();

    if (player.controls == undefined) {
        player.stop();
    } else {
        player.controls.stop();
    }

    window.clearInterval(state_interval_id);
}

function hashchanged() {
    var h = location.hash;
    console.log(h);

    if (h == '#play') {
        play();
    } else if (h == '#pause') {
        pause();
    }
}

function onwaiting() {
    console.log('==> waiting');
    parent.location.href = parent_url + '#waiting';
}

function onplaying() {
    console.log('==> playing');
    parent.location.href = parent_url + '#playing';
}

function onpaused() {
    console.log('==> pause');
}

function checkstate() {
    state_interval_id = window.setInterval(function() {
        console.log(last_pos);
        var current_pos = 0;
        if (player.controls == undefined) {
            current_pos = player.currentPosition;
            if (current_pos == undefined) {
                last_pos = 0;
                current_pos = 1;
            }
        } else {
            current_pos = player.controls.currentPosition;
        }

        if (current_pos == last_pos) {
            onwaiting();
        } else {
            onplaying();
        }

        last_pos = current_pos;
    }, 600);
}

document.addEventListener('DOMContentLoaded', function () {
    player = document.getElementById('mplayer');
    window.onhashchange = hashchanged;
    hashchanged();
});

