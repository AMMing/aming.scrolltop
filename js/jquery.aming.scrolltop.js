/**
* $.aming_nav
* @extends jquery.1.7.1
* @fileOverview 动态导航
* @author 阿命
* @email y2443@163.com
* @site wwww.y2443.com
* @version 1.03.14.0
* @date 2013-03-14
* Copyright (c) 2012-2013 AMing
* @example
*     var anav = $("#test").aming_nav({
*                datalist: [{
*                    left: -90,
*                    color: "#C5885B",
*                    imgurl: "images/31532569_200_50_t.jpg",
*                    title: "[Home]首页",
*                    link: "http://www.y2443.com",
*                    target: true
*                }]
*            });
*
*
*    anav.shownav();
*    anav.hidenav(400);
*/

(function (window, document, $, undefined) {
    $.extend($.fn, {
        version: '1.03.14.0',
        //随机的ID
        random_id: 0,
        //动画执行中
        nav_moveing: false,
        //导航是否显示
        nav_isshow: false,
        //导航Item数量
        nav_count: 0,

        //参数为datalist,
        //datalist里面的结构为 left,color,imgurl,title,link,target,mouseover,mouseover_time,mouseout
        aming_nav: function (setting, callback) {//默认值
            var sdata = $.extend({
                datalist: []
            }, setting);

            $.fn.random_id = parseInt(99999 * Math.random());

            var $renderTo = jQuery(this);
            var $nav_mainframe = jQuery("<div></div>");
            $nav_mainframe.addClass("aming_nav_mainframe");
            $nav_mainframe.addClass("aming_nav_mainframe" + $.fn.random_id);
            $nav_mainframe.css("position", "relative");
            $renderTo.append($nav_mainframe);

            var create_nav_item = function (data, $frame) {
                var img_top = 0;
                if (data.imgtop) {
                    img_top = data.imgtop;
                }
                var $nav_frame = jQuery("<div></div>");
                var $nav_img_button = jQuery("<div></div>");
                var $nav_img = jQuery("<img />");
                var $nav_title = jQuery("<div></div>");
                var $nav_img_button_defilade = jQuery("<span></span>");
                //set Class
                $nav_frame.addClass("aming_nav_frame");
                $nav_img_button.addClass("aming_nav_img_button");
                $nav_title.addClass("aming_nav_title");
                $nav_img.addClass("aming_nav_img");
                $nav_img_button_defilade.addClass("aming_nav_img_button_defilade");

                $nav_frame.css("position", "absolute");
                $nav_frame.css("width", "400px");
                $nav_frame.css("height", "104px");
                $nav_frame.css("padding", "5px");

                $nav_img_button.css("position", "absolute");
                $nav_img_button.css("width", "204px");
                $nav_img_button.css("height", "104px");
                $nav_img_button.css("z-index", "999");
                $nav_img_button.css("overflow", "hidden");
                $nav_img_button.css("border", "2px solid white");
                $nav_img_button.css("cursor", "pointer");
                $nav_img_button.css("background-color", "white");

                $nav_img.css("position", "absolute");
                //$nav_img.css("width", "400px");
                //$nav_img.css("height", "100px");
                $nav_img.css("border", "2px solid white");

                $nav_title.css("position", "absolute");
                $nav_title.css("font-family", '"Microsoft YaHei" , "Microsoft JhengHei"');
                $nav_title.css("line-height", "40px");
                $nav_title.css("padding", "15px 10px 0px 10px");
                $nav_title.css("font-size", "24px");
                $nav_title.css("bottom", "0");
                $nav_title.css("right", "0");

                //css3 text_shadow
                var text_shadow = "#fff 1px 0 0,#fff 0 1px 0,#fff -1px 0 0,#fff 0 -1px 0";
                $nav_title.css("-webkit-text-shadow", text_shadow);
                $nav_title.css("-moz-text-shadow", text_shadow);
                $nav_title.css("text-shadow", text_shadow);


                $nav_img_button_defilade.css("position", "absolute");
                $nav_img_button_defilade.css("width", "400px");
                $nav_img_button_defilade.css("height", "104px");
                $nav_img_button_defilade.css("color", "transparent");

                $frame.append($nav_frame);
                $nav_frame.append($nav_img_button);
                $nav_img_button.append($nav_img);
                $nav_img_button.append($nav_title);
                $nav_img_button.append($nav_img_button_defilade);

                //Set Attribute
                $nav_frame.attr("data-left", data.left);
                $nav_img_button.css("border-color", data.color);
                $nav_img_button.css("color", data.color);
                $nav_img.attr("src", data.imgurl);
                $nav_img.css("left", data.left);
                $nav_img.css("top", img_top);

                $nav_title.html(data.title);

                var mouseover_setTimeout = null;
                //bind event
                $nav_img_button.bind("mouseover", function () {
                    $nav_img_button.stop().animate({ width: 400 }, 300);
                    $nav_img.stop().animate({ left: 0 }, 300);

                    //如果有设置停留事件的话 再这边处理
                    if (data.mouseover && (data.mouseover instanceof Function)) {
                        if (!data.mouseover_time)
                            data.mouseover_time = 1000;
                        clearTimeout(mouseover_setTimeout);
                        mouseover_setTimeout = setTimeout(data.mouseover, data.mouseover_time, $nav_frame);
                    }
                });

                $nav_img_button.bind("mouseout", function () {
                    $nav_img_button.stop().animate({ width: 204 }, 300);
                    $nav_img.stop().animate({ left: data.left, top: img_top }, 300);

                    //移除停留事件延迟
                    clearTimeout(mouseover_setTimeout);


                    //如果有设置停留事件的话 再这边处理
                    if (data.mouseout && (data.mouseout instanceof Function)) {
                        data.mouseout($nav_frame);
                    }
                });

                $nav_img_button.bind("click", function () {
                    if (!data.link) {
                        return;
                    }
                    if (data.target) {
                        window.open(data.link);
                    } else {
                        window.location.href = data.link;
                    }
                });

                return $nav_frame;
            };

            $.each(sdata.datalist, function (index, item) {
                var $newitem = create_nav_item(item, $nav_mainframe);
                $newitem.attr("data-index", index);
                $newitem.css("z-index", 1000 - index);
                $newitem.addClass("aming_nav_frame_" + $.fn.random_id);
                //Temp
                $newitem.css("top", "-120px");
                $.fn.nav_count++;
            });

            return this;
        },

        //过滤掉指定index的nav
        get_nav_selector: function (s_index, e_index, plus) {
            var selector = "";
            for (var i = s_index; i <= e_index; plus ? i++ : i--) {
                selector += ":not([data-index='" + i + "'])";
            }
            return selector;
        },
        //显示
        shownav: function (time) {
            if ($.fn.nav_moveing || $.fn.nav_isshow) {
                return;
            }

            if (!time)
                time = 300;

            var newtop = 0;
            var index = 0;
            var move_animate = function () {
                if ($.fn.nav_count <= index) {
                    $.fn.nav_moveing = false;
                    $.fn.nav_isshow = true;
                    return;
                }

                newtop = index * (100 + 14);
                var $navs = jQuery(".aming_nav_frame_" + $.fn.random_id + $.fn.get_nav_selector(0, index - 1, true));
                $navs.animate({ top: newtop }, time, function (a, b, c, d) {
                    //防止多个同时进行的动画 都再执行一次事件
                    var dataindex = jQuery(this).attr("data-index")
                    if (parseInt(dataindex) == $.fn.nav_count - 1) {
                        index++;
                        move_animate();
                    }
                });
            };

            $.fn.nav_moveing = true;
            move_animate();
        },

        hidenav: function (time) {
            if ($.fn.nav_moveing || !$.fn.nav_isshow) {
                return;
            }

            if (!time)
                time = 300;

            var newtop = 0;
            var index = $.fn.nav_count - 1;
            var temp = 0;
            var move_animate = function () {
                if (index < 0) {
                    $.fn.nav_moveing = false;
                    $.fn.nav_isshow = false;
                    return;
                }

                var $navs = jQuery(".aming_nav_frame_" + $.fn.random_id + $.fn.get_nav_selector(0, index - 1, true));

                newtop = (index - 1) * (100 + 14);

                $navs.animate({ top: newtop }, time, function () {
                    //防止多个同时进行的动画 都再执行一次事件
                    var dataindex = jQuery(this).attr("data-index")
                    if (parseInt(dataindex) == index) {
                        index--;
                        move_animate();
                    }
                });

            };

            $.fn.nav_moveing = true;
            move_animate();
        }
    });
})(window, document, jQuery);