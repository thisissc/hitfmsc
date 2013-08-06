
var intervalId = null;
var audio_status_code = {
    PLAYING: 1,
    LOADING: 0,
    STOP: -1,
    ERROR: -2
};
var audio_status = audio_status_code.STOP;

var MP3Audio = {
    init: function() {
        this.player = new Audio();
        this.player.addEventListener('waiting', this.onAudioWaiting);
        this.player.addEventListener('playing', this.onAudioPlaying);
    },
    play: function() {
        this.player.src = 'http://58.68.255.152/hitfm.mp3';
        this.player.play();
    },
    pause: function() {
        this.player.pause();
        this.player.src = '';
    },
    onAudioWaiting: function() {
        audio_status = audio_status_code.LOADING;
        set_badge();
    },
    onAudioPlaying: function() {
        window.clearInterval(intervalId);
        audio_status = audio_status_code.PLAYING;
        set_badge();
    }
};

var MMSAudio = {
    init: function() {
        this.player = $('#player');
    },
    play: function() {
        if (this._frame == null) {
            this.player.html('<iframe id="embed_player_frame" src="' + this._frame_url + '"></iframe>');
            this._frame = $('#embed_player_frame')[0];
        }
        this._frame.src = this._frame_url + '#play';
    },
    pause: function() {
        this._frame.src = this._frame_url + '#pause';
    },
    _frame: null,
    //_frame_url: 'http://211.151.146.142/ykhybrid/static/embed_player.html',
    _frame_url: 'http://211.151.146.142/ykhybrid/static/embed_player_test.html',
};

function play() {
    audio.play();
    audio_status = audio_status_code.PLAYING;
    set_badge();
}

function pause() {
    audio.pause();
    audio_status = audio_status_code.STOP;
    set_badge();
}

function error() {
    audio.pause();
    audio_status = audio_status_code.ERROR;
    set_badge();
}

function set_badge() {
    var C_GREEN = '#00FF00';
    var C_YELLOW = '#FFFF00';
    var C_RED = '#FF0000';

    window.clearInterval(intervalId);
    switch (audio_status) {
        case audio_status_code.PLAYING:
            chrome.browserAction.setBadgeBackgroundColor({color: C_GREEN});
            chrome.browserAction.setBadgeText({text: ' '});
            break;
        case audio_status_code.LOADING:
            chrome.browserAction.setBadgeBackgroundColor({color: C_GREEN});
            chrome.browserAction.setBadgeText({text: ' '});

            var i = 0;
            intervalId = window.setInterval(function (){
                chrome.browserAction.setBadgeBackgroundColor({color: i%2==0?C_YELLOW:C_GREEN});
                i++;

                if (i > 500) {
                    error();
                }
            }, 600);

            break;
        case audio_status_code.ERROR:
            chrome.browserAction.setBadgeBackgroundColor({color: C_RED});
            chrome.browserAction.setBadgeText({text: ' '});
            break;
        case audio_status_code.STOP:
        default:
            chrome.browserAction.setBadgeText({text: ''});
            chrome.browserAction.setBadgeBackgroundColor({color: C_GREEN});
            break;
    }
}

function toggle_click() {
    if (audio_status != audio_status_code.STOP) {
        pause();
        _gaq.push(['_trackEvent', 'Audios', 'Pause', 'Click to pause']);
    } else {
        play();
        _gaq.push(['_trackEvent', 'Audios', 'Play', 'Click to play']);
    }
}

var audio = MMSAudio;

$(function() {
    audio.init();
    chrome.browserAction.onClicked.addListener(toggle_click);
    set_badge();
});

