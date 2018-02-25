/* AlloyFinger v0.1.10
 * By dntzhang
 * Github: https://github.com/AlloyTeam/AlloyFinger
 */
; (function () {
    //获取多指触摸操作的时候，手指触摸的位置之间的距离
    //多指触摸操作的时候，v.x表示手指之间的水平间距，v.y表示垂直间距，利用勾股定理的公式计算出手指触点之间的直线距离
    //详解：将v.x的水平间距和v.y的垂直间距用直线连接起来，就形成了一个直角三角形的两条垂直边，指触点之间的直线距离就代表直角三角形的斜边
    //那么利用勾股定理公式就可以很容易的计算出斜边的长度，也就是手指触点之间的直线距离
    function getLen(v) {
        return Math.sqrt(v.x * v.x + v.y * v.y);
    }

    function dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y;
    }

    function getAngle(v1, v2) {
        var mr = getLen(v1) * getLen(v2);
        if (mr === 0) return 0;
        var r = dot(v1, v2) / mr;
        if (r > 1) r = 1;
        return Math.acos(r);
    }

    //利用cross结果的正负来判断旋转的方向,如果值大于0，表示方向是逆时针，值小于0，表示方向顺时针
    function cross(v1, v2) {
        return v1.x * v2.y - v2.x * v1.y;
    }

    function getRotateAngle(v1, v2) {
        var angle = getAngle(v1, v2);
        if (cross(v1, v2) > 0) {
            angle *= -1;
        }

        return angle * 180 / Math.PI;
    }

    var HandlerAdmin = function(el) {
        this.handlers = [];
        this.el = el;
    };

    HandlerAdmin.prototype.add = function(handler) {
        this.handlers.push(handler);
    }

    HandlerAdmin.prototype.del = function(handler) {
        if(!handler) this.handlers = [];

        for(var i=this.handlers.length; i>=0; i--) {
            if(this.handlers[i] === handler) {
                this.handlers.splice(i, 1);
            }
        }
    }

    HandlerAdmin.prototype.dispatch = function() {
        for(var i=0,len=this.handlers.length; i<len; i++) {
            var handler = this.handlers[i];
            if(typeof handler === 'function') handler.apply(this.el, arguments);
        }
    }

    //观察者模式，主体是HandlerAdmin
    function wrapFunc(el, handler) {
        var handlerAdmin = new HandlerAdmin(el);
        handlerAdmin.add(handler);

        return handlerAdmin;
    }

    //AlloyFinger构造函数，手势库的入口
    //el是手势库作用的DOM元素，el的值可以是选择器也可以是DOM元素
    //option是个数据对象，包含了所有的操作回调函数
    var AlloyFinger = function (el, option) {

        //判断el的值时选择器还是DOM元素
        this.element = typeof el == 'string' ? document.querySelector(el) : el;

        this.start = this.start.bind(this);
        this.move = this.move.bind(this);
        this.end = this.end.bind(this);
        this.cancel = this.cancel.bind(this);

        //监听touch事件
        this.element.addEventListener("touchstart", this.start, false);
        this.element.addEventListener("touchmove", this.move, false);
        this.element.addEventListener("touchend", this.end, false);
        this.element.addEventListener("touchcancel", this.cancel, false);

        //存储两个或多个手指触摸点的位置的间距，水平间距和垂直间距
        this.preV = { x: null, y: null };
        //存储多指触摸操作时，手指触摸位置之间的距离
        this.pinchStartLen = null;
        this.zoom = 1;
        //操作是否为双击
        this.isDoubleTap = false;

        //定义一个空函数
        var noop = function () { };

        /**
         * API部分
         * 订阅者
         */

        //旋转操作（多指操作）
        this.rotate = wrapFunc(this.element, option.rotate || noop);
        //手指触摸开始
        this.touchStart = wrapFunc(this.element, option.touchStart || noop);
        //多指触摸开始
        this.multipointStart = wrapFunc(this.element, option.multipointStart || noop);
        //多指触摸结束
        this.multipointEnd = wrapFunc(this.element, option.multipointEnd || noop);
        //捏（缩放操作）
        this.pinch = wrapFunc(this.element, option.pinch || noop);
        //手指划过操作（兼容单个手指操作，多个手指操作）
        this.swipe = wrapFunc(this.element, option.swipe || noop);
        //点击操作
        this.tap = wrapFunc(this.element, option.tap || noop);
        //双击操作
        this.doubleTap = wrapFunc(this.element, option.doubleTap || noop);
        //长按操作
        this.longTap = wrapFunc(this.element, option.longTap || noop);
        //点击操作
        //tap操作和singleTap操作的区别在于，如果是在一定时间内只是单击一次的话，触发的操作顺序是tap->singleTap
        //如果是在一定时间内连续多次点击的话（包括双击操作），只会执行tap操作，不会执行singleTap操作
        //singleTap操作其实就类似于鼠标click事件，click事件作用到移动端页面的时候，会存在延时触发事件，会先触发touch事件再执行click事件
        this.singleTap = wrapFunc(this.element, option.singleTap || noop);
        //单个手指触摸滑动操作
        this.pressMove = wrapFunc(this.element, option.pressMove || noop);
        //两个手指触摸滑动操作
        this.twoFingerPressMove = wrapFunc(this.element, option.twoFingerPressMove || noop);
        //触摸滑动
        this.touchMove = wrapFunc(this.element, option.touchMove || noop);
        //触摸结束，手指离开屏幕
        this.touchEnd = wrapFunc(this.element, option.touchEnd || noop);
        //系统原因中断手势操作
        this.touchCancel = wrapFunc(this.element, option.touchCancel || noop);

        this._cancelAllHandler = this.cancelAll.bind(this);
        window.removeEventListener('scroll', this._cancelAllHandler);

        window.addEventListener('scroll', this._cancelAllHandler);

        //手指连续按下触摸操作之间的时间间隔
        this.delta = null;
        //手指最近一次按下触摸操作时的时间戳
        this.last = null;
        //手指按下触摸操作的时间戳
        this.now = null;
        //接收点击操作时的定时器返回的值，用于清除定时器
        this.tapTimeout = null;
        //接收点击操作时的定时器返回的值，用于清除定时器
        this.singleTapTimeout = null;
        //接收长按操作时的定时器返回的值，用于清除定时器
        this.longTapTimeout = null;
        this.swipeTimeout = null;
        this.x1 = this.x2 = this.y1 = this.y2 = null;
        //用于存储手指触摸操作时的水平坐标和垂直坐标
        this.preTapPosition = { x: null, y: null };
    };

    AlloyFinger.prototype = {
        //手指触摸时触发的事件
        start: function (evt) {
            if (!evt.touches) return;
            //获取手指触点触摸时的时间戳
            this.now = Date.now();
            //获取手指触点相对于HTML文档左边沿的的X坐标
            this.x1 = evt.touches[0].pageX;
            //获取手指触点相对于HTML文档上边沿的的Y坐标
            this.y1 = evt.touches[0].pageY;
            //计算出手指连续按下触摸操作之间的时间间隔
            this.delta = this.now - (this.last || this.now);
            this.touchStart.dispatch(evt, this.element);
            if (this.preTapPosition.x !== null) {
                //如果手指连续触摸操作之间的时间间隔小于250毫秒，且手指连续触摸操作之间的触点位置水平坐标小于30，垂直坐标小于30，那么就判定该操作为双击操作
                this.isDoubleTap = (this.delta > 0 && this.delta <= 250 && Math.abs(this.preTapPosition.x - this.x1) < 30 && Math.abs(this.preTapPosition.y - this.y1) < 30);
            }
            this.preTapPosition.x = this.x1;
            this.preTapPosition.y = this.y1;
            this.last = this.now;
            var preV = this.preV,
                //获取触摸点的数量
                len = evt.touches.length;
            //触摸点的数量大于1，表示是多手指操作
            if (len > 1) {
                this._cancelLongTap();
                this._cancelSingleTap();
                //如果是多手指操作的，计算出手指触摸点的位置的间距，水平间距和垂直间距
                var v = { x: evt.touches[1].pageX - this.x1, y: evt.touches[1].pageY - this.y1 };
                preV.x = v.x;
                preV.y = v.y;

                //获取手指触摸点的直线距离
                this.pinchStartLen = getLen(preV);
                this.multipointStart.dispatch(evt, this.element);
            }
            //判断操作是单击还是长按，true为长按操作，false为单击操作
            this._preventTap = false;
            //长按时的操作，长按时间750毫秒才会执行
            this.longTapTimeout = setTimeout(function () {
                this.longTap.dispatch(evt, this.element);
                this._preventTap = true;
            }.bind(this), 750);
        },
        //手指滑动时触发的事件
        move: function (evt) {
            if (!evt.touches) return;
            var preV = this.preV,
                len = evt.touches.length,
                //获取手指触点相对于HTML文档左边沿的的X坐标
                currentX = evt.touches[0].pageX,
                //获取手指触点相对于HTML文档上边沿的的Y坐标
                currentY = evt.touches[0].pageY;
            //手指滑动的时候，就可以判定当前的操作不是双击了，所以把双击操作的状态设为false
            this.isDoubleTap = false;
            //多个手指操作
            if (len > 1) {
                var sCurrentX = evt.touches[1].pageX,
                    sCurrentY = evt.touches[1].pageY
                var v = { x: evt.touches[1].pageX - currentX, y: evt.touches[1].pageY - currentY };

                //多指操作时，且触摸点位置的间距存在，也就是preV.x或者preV.y存在的时候才能执行pinch操作，这个判断条件必须存在
                //（因为可能存在当多个手指触摸屏幕时，那么存在多个触摸点，但是在滑动操作的同时，只保留了一个手指触摸点，其他手指移开屏幕这样的情况，这种情况就不能执行pinch操作
                if (preV.x !== null) {
                    if (this.pinchStartLen > 0) {
                        //计算出缩放比例（当前手指触摸点的直线距离 / 上一次的手指触摸点的直线距离）
                        evt.zoom = getLen(v) / this.pinchStartLen;
                        this.pinch.dispatch(evt, this.element);
                    }

                    //旋转手势操作
                    evt.angle = getRotateAngle(v, preV);
                    this.rotate.dispatch(evt, this.element);
                }
                preV.x = v.x;
                preV.y = v.y;

                if (this.x2 !== null && this.sx2 !== null) {
                    evt.deltaX = (currentX - this.x2 + sCurrentX - this.sx2) / 2;
                    evt.deltaY = (currentY - this.y2 + sCurrentY - this.sy2) / 2;
                } else {
                    evt.deltaX = 0;
                    evt.deltaY = 0;
                }
                this.twoFingerPressMove.dispatch(evt, this.element);

                this.sx2 = sCurrentX;
                this.sy2 = sCurrentY;
            } else {
                if (this.x2 !== null) {
                    evt.deltaX = currentX - this.x2;
                    evt.deltaY = currentY - this.y2;

                } else {
                    evt.deltaX = 0;
                    evt.deltaY = 0;
                }


                this.pressMove.dispatch(evt, this.element);
            }

            this.touchMove.dispatch(evt, this.element);

            this._cancelLongTap();
            this.x2 = currentX;
            this.y2 = currentY;

            if (len > 1) {
                evt.preventDefault();
            }
        },

        //手指离开时的触发事件
        end: function (evt) {
            if (!evt.changedTouches) return;
            //清除长按操作的定时器，取消长按操作
            this._cancelLongTap();
            var self = this;
            if (evt.touches.length < 2) {
                this.multipointEnd.dispatch(evt, this.element);
                this.sx2 = this.sy2 = null;
            }

            //swipe
            if ((this.x2 && Math.abs(this.x1 - this.x2) > 30) ||
                (this.y2 && Math.abs(this.y1 - this.y2) > 30)) {
                evt.direction = this._swipeDirection(this.x1, this.x2, this.y1, this.y2);
                this.swipeTimeout = setTimeout(function () {
                    self.swipe.dispatch(evt, this.element);

                }, 0)
            } else {
                this.tapTimeout = setTimeout(function () {
                    if(!self._preventTap){
                        self.tap.dispatch(evt, this.element);
                    }
                    // trigger double tap immediately
                    // 如果是双击操作的话，就执行
                    if (self.isDoubleTap) {
                        self.doubleTap.dispatch(evt, this.element);
                        clearTimeout(self.singleTapTimeout);
                        self.isDoubleTap = false;
                    }
                }, 0)

                //如果不是双击操作，就会延时250毫秒执行singleTap操作，同时也会执行tap操作，执行顺序是tap->singleTap
                if (!self.isDoubleTap) {
                    self.singleTapTimeout = setTimeout(function () {
                        self.singleTap.dispatch(evt, this.element);
                    }, 250);
                }
            }

            this.touchEnd.dispatch(evt, this.element);

            this.preV.x = 0;
            this.preV.y = 0;
            this.zoom = 1;
            this.pinchStartLen = null;
            this.x1 = this.x2 = this.y1 = this.y2 = null;
        },
        cancelAll: function () {
            this._preventTap = true
            clearTimeout(this.singleTapTimeout);
            clearTimeout(this.tapTimeout);
            clearTimeout(this.longTapTimeout);
            clearTimeout(this.swipeTimeout);
        },
        cancel: function (evt) {
            this.cancelAll()
            this.touchCancel.dispatch(evt, this.element);
        },
        _cancelLongTap: function () {
            clearTimeout(this.longTapTimeout);
        },
        _cancelSingleTap: function () {
            clearTimeout(this.singleTapTimeout);
        },
        //判定滑动的方向
        _swipeDirection: function (x1, x2, y1, y2) {
            return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
        },

        //绑定自定义事件
        on: function(evt, handler) {
            if(this[evt]) {
                this[evt].add(handler);
            }
        },

        //解绑自定义事件
        off: function(evt, handler) {
            if(this[evt]) {
                this[evt].del(handler);
            }
        },

        //销毁掉所有的操作数据
        destroy: function() {
            //清除所有的定时器操作
            if(this.singleTapTimeout) clearTimeout(this.singleTapTimeout);
            if(this.tapTimeout) clearTimeout(this.tapTimeout);
            if(this.longTapTimeout) clearTimeout(this.longTapTimeout);
            if(this.swipeTimeout) clearTimeout(this.swipeTimeout);

            //解绑所有的监听事件
            this.element.removeEventListener("touchstart", this.start);
            this.element.removeEventListener("touchmove", this.move);
            this.element.removeEventListener("touchend", this.end);
            this.element.removeEventListener("touchcancel", this.cancel);

            //取消所有的订阅
            this.rotate.del();
            this.touchStart.del();
            this.multipointStart.del();
            this.multipointEnd.del();
            this.pinch.del();
            this.swipe.del();
            this.tap.del();
            this.doubleTap.del();
            this.longTap.del();
            this.singleTap.del();
            this.pressMove.del();
            this.twoFingerPressMove.del()
            this.touchMove.del();
            this.touchEnd.del();
            this.touchCancel.del();

            //自空所有的数据
            this.preV = this.pinchStartLen = this.zoom = this.isDoubleTap = this.delta = this.last = this.now = this.tapTimeout = this.singleTapTimeout = this.longTapTimeout = this.swipeTimeout = this.x1 = this.x2 = this.y1 = this.y2 = this.preTapPosition = this.rotate = this.touchStart = this.multipointStart = this.multipointEnd = this.pinch = this.swipe = this.tap = this.doubleTap = this.longTap = this.singleTap = this.pressMove = this.touchMove = this.touchEnd = this.touchCancel = this.twoFingerPressMove = null;

            return null;
        }
    };

    if (typeof module !== 'undefined' && typeof exports === 'object') {
        module.exports = AlloyFinger;
    } else {
        window.AlloyFinger = AlloyFinger;
    }
})();
