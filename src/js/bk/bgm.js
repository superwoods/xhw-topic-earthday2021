const audios = $('#music-audio')['0'];

function playAudio() {
    audios.play();
    $('.jp-audio').addClass('jp-state-playing');
}

function playPause() {
    audios.pause();
    $('.jp-audio').removeClass('jp-state-playing'); //jp-state-looped 
}

if (isDev == false) {
    playAudio();
    document.addEventListener("WeixinJSBridgeReady", function () {
        playAudio();
    }, false);
}

$('.icon-music').on('click', function () {
    if ($('.jp-audio').hasClass('jp-state-playing')) {
        playPause();
        document.addEventListener("WeixinJSBridgeReady", function () {
            playPause();
        }, false);
    } else {
        playAudio();
    }
});
