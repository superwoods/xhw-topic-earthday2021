@import './eraser.js'

$(() => {

    window.addEventListener('load', function () {
        var canvas = document.querySelector('#canvas'),
            eraser = new Eraser(canvas, 'bundle/face.png');
        eraser.init();
    }, false);

});