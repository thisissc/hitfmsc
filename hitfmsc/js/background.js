var console = chrome.extension.getBackgroundPage().console;
console.log = function() {}

var audio_state_code = {
    PLAYING: 1,
    WAITING: 0,
    STOP: -1,
    ERROR: -2
};

var audio = {
    init: function() {
        this.player = $('#player');
        this.set_state(audio_state_code.STOP);
    },
    play: function() {
        console.log('++> play');
        if (this._frame == null) {
            this.player.html('<iframe id="embed_player_frame" src="' + this._frame_url + '#play"></iframe>');
            this._frame = $('#embed_player_frame')[0];
        }
        this._frame.src = this._frame_url + '#play';
        this.set_state(audio_state_code.PLAYING);
    },
    pause: function() {
        console.log('++> pause');
        this._frame.src = this._frame_url + '#pause';
        this.set_state(audio_state_code.STOP);
    },
    error: function() {
        console.log('++> error');
        this._frame.src = this._frame_url + '#pause';
        this.set_state(audio_state_code.ERROR);
    },
    set_state: function(state_code) {
        this.state = state_code;

        var C_GREEN = '#00FF00';
        var C_YELLOW = '#FFFF00';
        var C_RED = '#FF0000';

        window.clearInterval(this._bage_interval);
        switch (this.state) {
            case audio_state_code.PLAYING:
                chrome.browserAction.setBadgeBackgroundColor({color: C_GREEN});
                chrome.browserAction.setBadgeText({text: ' '});
                break;
            case audio_state_code.WAITING:
                chrome.browserAction.setBadgeBackgroundColor({color: C_GREEN});
                chrome.browserAction.setBadgeText({text: ' '});

                var _self = this;
                var i = 0;
                this._bage_interval = window.setInterval(function (){
                    chrome.browserAction.setBadgeBackgroundColor({color: i%2==0?C_YELLOW:C_GREEN});
                    i++;

                    if (i > 200) {
                        _self.error();
                    }
                }, 600);

                break;
            case audio_state_code.ERROR:
                chrome.browserAction.setBadgeBackgroundColor({color: C_RED});
                chrome.browserAction.setBadgeText({text: ' '});
                break;
            case audio_state_code.STOP:
            default:
                chrome.browserAction.setBadgeText({text: ''});
                chrome.browserAction.setBadgeBackgroundColor({color: C_GREEN});
                break;
        }
    },
    state: null,
    _bage_interval: null,
    _frame: null,
    _frame_url: 'http://thisissc.sinaapp.com/static/embed_player.html?extid=' + chrome.runtime.id,
};


function toggle_click() {
    if (audio.state != audio_state_code.STOP) {
        audio.pause();
        ga('send', 'event', 'Audios', 'Pause', 'Click to pause');
    } else {
        audio.play();
        ga('send', 'event', 'Audios', 'Play', 'Click to play');
    }
}

function onhashchanged() {
    var h = location.hash;

    if (h == '#waiting') {
        audio.set_state(audio_state_code.WAITING);
    } else if (h == '#playing') {
        audio.set_state(audio_state_code.PLAYING);
    }
}


$(function() {
    audio.init();
    chrome.browserAction.onClicked.addListener(toggle_click);
    window.onhashchange = onhashchanged;
});

