// google analytics
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-42723420-1']);
_gaq.push(['_trackPageview']);

(function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

// player
var audio = new Audio();
var intervalId = null;
var audio_status_code = {
    PLAYING: 1,
    LOADING: 0,
    STOP: -1,
    ERROR: -2
}
var audio_status = audio_status_code.STOP;

function play() {
    var src = 'http://58.68.255.152/hitfm.mp3';
    if (audio.src != src) {
        audio.src = src;
    }
    audio.play();
    audio_status = audio_status_code.PLAYING;
    set_badge();
}

function pause() {
    audio.pause();
    audio.src = "";
    audio_status = audio_status_code.STOP;
    set_badge();
}

function error() {
    audio.src = "";
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

function onAudioWaiting() {
    audio_status = audio_status_code.LOADING;
    set_badge();
}

function onAudioPlaying() {
    window.clearInterval(intervalId);
    audio_status = audio_status_code.PLAYING;
    set_badge();
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

audio.addEventListener('waiting', onAudioWaiting);
audio.addEventListener('playing', onAudioPlaying);
chrome.browserAction.onClicked.addListener(toggle_click);
set_badge();

