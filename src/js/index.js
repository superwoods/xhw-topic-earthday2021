@import './eraser.js'

$(() => {
    if (isPc) {
        $('html').addClass('isMdBox');
    } else {
        [1, 2, 3, 4].map((e, i) => {
            console.log(e, i);
            var canvas = document.querySelector('#canvas' + e),
                eraser = new Eraser(canvas, 'bundle/dirty/high5_0' + (e + 1) + '.jpg', $('.bgPos' + e), $('#canvas' + e));
            eraser.init();
        });
    }
});

@import './wxshare.js'