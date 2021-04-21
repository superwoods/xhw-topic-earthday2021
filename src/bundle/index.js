'use strict';

(function (exports) {
    var document = exports.document,
        hastouch = 'ontouchstart' in exports ? true : false,
        tapstart = hastouch ? 'touchstart' : 'mousedown',
        tapmove = hastouch ? 'touchmove' : 'mousemove',
        tapend = hastouch ? 'touchend' : 'mouseup',
        x1,
        y1,
        x2,
        y2;

    function Eraser(canvas, imgUrl, $target, $canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.imgUrl = imgUrl;
        this.timer = null;
        this.lineWidth = 30;
        this.gap = 10;
        this.$target = $target;
        this.$canvas = $canvas;
    }

    exports.Eraser = Eraser;

    Eraser.prototype = {
        init: function init(args) {
            for (var p in args) {
                this[p] = args[p];
            }
            var _this = this,
                img = new Image();

            this.canvasWidth = this.canvas.width = Math.min(document.body.offsetWidth, 640);
            // this.canvasHeight = this.canvas.height;
            img.src = this.imgUrl;
            // img.setAttribute('crossOrigin', '');
            img.onload = function () {
                _this.canvasHeight = _this.canvasWidth * this.height / this.width;
                _this.canvas.height = _this.canvasHeight;

                _this.ctx.drawImage(this, 0, 0, _this.canvasWidth, _this.canvasHeight);
                _this.initEvent();

                _this.$target.height(_this.canvasHeight).addClass('addBg');
            };
        },
        initEvent: function initEvent() {
            this.ctx.lineCap = 'round';
            this.ctx.lineJoin = 'round';
            this.ctx.lineWidth = this.lineWidth;
            this.ctx.globalCompositeOperation = 'destination-out';

            this.tapMoveHandler = this.onTapMove.bind(this);
            this.tapStartHandler = this.onTapStart.bind(this);
            this.tapEndHandler = this.onTapEnd.bind(this);
            this.canvas.addEventListener(tapstart, this.tapStartHandler, false);
            this.canvas.addEventListener(tapend, this.tapEndHandler, false);
        },
        onTapStart: function onTapStart(ev) {
            console.log('onTapStart!!');
            $('.hand3').fadeOut(2000, function () {
                $('.hand3').remove();
            });

            ev.preventDefault();
            x1 = hastouch ? ev.targetTouches[0].pageX - this.canvas.offsetLeft : ev.pageX - this.canvas.offsetLeft;
            y1 = hastouch ? ev.targetTouches[0].pageY - this.canvas.offsetTop : ev.pageY - this.canvas.offsetTop;

            // this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(x1, y1, 1, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.stroke();
            // this.ctx.restore();

            this.canvas.addEventListener(tapmove, this.tapMoveHandler, false);
        },
        onTapMove: function onTapMove(ev) {
            ev.preventDefault();
            var _this = this;
            if (!this.timer) {
                this.timer = setTimeout(function () {
                    x2 = hastouch ? ev.targetTouches[0].pageX - _this.canvas.offsetLeft : ev.pageX - _this.canvas.offsetLeft;
                    y2 = hastouch ? ev.targetTouches[0].pageY - _this.canvas.offsetTop : ev.pageY - _this.canvas.offsetTop;

                    // _this.ctx.save();
                    _this.ctx.moveTo(x1, y1);
                    _this.ctx.lineTo(x2, y2);
                    _this.ctx.stroke();
                    // _this.ctx.restore();

                    x1 = x2;
                    y1 = y2;
                    _this.timer = null;
                }, 40);
            }
        },
        onTapEnd: function onTapEnd(ev) {
            console.log(1);
            ev.preventDefault();
            var _this = this,
                i = 0,
                count = 0,
                imgData = this.ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);

            for (var x = 0; x < imgData.width; x += this.gap) {
                for (var y = 0; y < imgData.height; y += this.gap) {
                    i = (y * imgData.width + x) * 4;
                    if (imgData.data[i + 3] > 0) {
                        count++;
                    }
                }
            }

            if (count / (imgData.width * imgData.height / (this.gap * this.gap)) < 0.9) {
                setTimeout(function () {
                    _this.removeEvent();
                    // document.body.removeChild(_this.canvas);
                    _this.$canvas.fadeOut(2000);
                    _this.canvas = null;
                }, 40);
            } else {
                this.canvas.removeEventListener(tapmove, this.tapMoveHandler, false);
            }
        },
        removeEvent: function removeEvent() {
            this.canvas.removeEventListener(tapstart, this.tapStartHandler, false);
            this.canvas.removeEventListener(tapend, this.tapEndHandler, false);
            this.canvas.removeEventListener(tapmove, this.tapMoveHandler, false);
        }
    };
})(window);

$(function () {
    if (isPc) {
        $('html').addClass('isMdBox');
    } else {
        [1, 2, 3, 4].map(function (e, i) {
            console.log(e, i);
            var canvas = document.querySelector('#canvas' + e),
                eraser = new Eraser(canvas, 'bundle/dirty/high5_0' + (e + 1) + '.jpg', $('.bgPos' + e), $('#canvas' + e));
            eraser.init();
        });
    }
});

function wxShareFn() {
    var wxShareHref = window.location.href;
    // cb 是  http://api.home.news.cn/wx/jsapi.do?callback=cb&mpId=375&url=http%3A%2F%2Fwww.xiongan.gov.cn%2F2018-06%2F02%2Fc_129885537.htm 的回调函数, 需要到全局

    window.cbEarthDay2021 = function cbEarthDay2021(data) {
        // if (data.code !== 200) console.log("shibai");
        // console.log(data);
        wx.config({
            debug: false, // true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: data.content.appId, // 必填，公众号的唯一标识
            timestamp: data.content.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.content.nonceStr, // 必填，生成签名的随机串
            signature: data.content.signature, // 必填，签名，见附录1
            jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });

        wx.ready(function () {
            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
            // 1 判断当前版本是否支持指定 JS 接口，支持批量判断
            wx.checkJsApi({
                jsApiList: ['getNetworkType', 'previewImage']
                // success: function (res) {
                //     console.log('res:', res);
                //     //alert(JSON.stringify(res));
                // }
            });

            var shareTit = '世界地球日'; // MAIT_title || $('title').text();
            var sharesum = '让我们一起守护地球'; // sharesumTxt || 
            var shareImg = 'http://www.xinhuanet.com/talking/earthday2021/bundle/wxshare.jpg';
            // const shareUrl = wxShareHref;

            // 2. 分享接口
            // 2.1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
            wx.onMenuShareAppMessage({
                title: shareTit,
                desc: sharesum,
                link: wxShareHref,
                imgUrl: shareImg
            });

            // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
            wx.onMenuShareTimeline({
                title: shareTit,
                link: wxShareHref,
                imgUrl: shareImg
            });

            // 2.3 监听“分享到QQ”按钮点击、自定义分享内容及分享结果接口
            wx.onMenuShareQQ({
                title: shareTit,
                desc: sharesum,
                link: wxShareHref,
                imgUrl: shareImg
            });

            // 2.4 监听“分享到微博”按钮点击、自定义分享内容及分享结果接口
            wx.onMenuShareWeibo({
                title: shareTit,
                desc: sharesum,
                link: wxShareHref,
                imgUrl: shareImg
            });

            // 2.5 监听“分享到QZone”按钮点击、自定义分享内容及分享接口
            wx.onMenuShareQZone({
                title: shareTit,
                desc: sharesum,
                link: wxShareHref,
                imgUrl: shareImg
            });
        });

        // wx.error(function (res) {
        //     // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        //     console.log(res, error);
        // });
    };

    var tag = document.createElement("script");

    tag.src = function () {
        var wxShareMpId = 356; //375 = xiongan.gov.cn
        var url = wxShareHref.substring(0, wxShareHref.indexOf('#') < 0 ? undefined : wxShareHref.indexOf('#'));
        var weShareCbUrl = 'http://api.home.news.cn/wx/jsapi.do?callback=cbEarthDay2021&mpId=' + wxShareMpId + '&url=' + encodeURIComponent(url);

        console.log('weShareCbUrl:', weShareCbUrl);

        return weShareCbUrl;
    }();

    document.querySelector("body").appendChild(tag);
}

wxShareFn();