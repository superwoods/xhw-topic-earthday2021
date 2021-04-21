function wxShareFn(MAIT_title, sharesumTxt) {
    var wxShareHref = window.location.href;
    // cb 是  http://api.home.news.cn/wx/jsapi.do?callback=cb&mpId=375&url=http%3A%2F%2Fwww.xiongan.gov.cn%2F2018-06%2F02%2Fc_129885537.htm 的回调函数, 需要到全局

    window.cb2021Qingming = function cb2021Qingming(data) {
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

            var shareTit = '山河无恙 英雄不朽'; // MAIT_title || $('title').text();
            var sharesum = '苍山巍巍 江水泱泱 英烈意志 永续传扬'; // sharesumTxt || 
            var shareImg = 'http://www.xinhuanet.com/talking/2021qingming/bundle/wxshare.jpg';
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
        var weShareCbUrl = 'http://api.home.news.cn/wx/jsapi.do?callback=cb2021Qingming&mpId=' + wxShareMpId + '&url=' + encodeURIComponent(url);

        console.log('weShareCbUrl:', weShareCbUrl);

        return weShareCbUrl;
    }();

    document.querySelector("body").appendChild(tag);
}

