;(function (window, undefined) {
    function getLen(v) {
        return Math.sqrt(v.x * v.x + v.y * v.y);
    }

    function HandlerAdmin(el) {
        this.handlers = [];
        this.el = el;
    }
    HandlerAdmin.prototype.add = function(handler) {
        if(this.handlers[handler]) return;
        this.handlers.push(handler);
    };
    HandlerAdmin.prototype.dispatch = function() {
        for(var i=0,len=this.handlers.length; i<len; i++) {
            var handler = this.handlers[i];
            if(typeof handler === 'function') handler.apply(this.el, arguments);
        }
    };

    function wrapFunc(el, handler) {
        var handlerAdmin = new HandlerAdmin(el);
        handlerAdmin.add(handler);
        return handlerAdmin;
    }

    var Mtouch = function(el, options) {
        this.element = typeof el === 'string' ? document.querySelector(el) : el;

        this.start = this.start.bind(this);
        this.move = this.move.bind(this);
        this.end = this.end.bind(this);

        this.element.addEventListener("touchstart", this.start, false);
        this.element.addEventListener("touchmove", this.move, false);
        this.element.addEventListener("touchend", this.end, false);

        var temp = function() {};
        this.touchStart = wrapFunc(this.element, options.touchStart || temp);
        this.touchMove = wrapFunc(this.element, options.touchMove || temp);
        this.touchEnd = wrapFunc(this.element, options.touchEnd || temp);
        this.tap = wrapFunc(this.element, options.tap || temp);
        this.longTap = wrapFunc(this.element, options.longTap || temp);
        this.doubleTap = wrapFunc(this.element, options.doubleTap || temp);
        this.singleTap = wrapFunc(this.element, options.singleTap || temp);
        this.multipointStart = wrapFunc(this.element, options.multipointStart || temp);
        this.multipointEnd = wrapFunc(this.element, options.multipointEnd || temp);
        this.pinch = wrapFunc(this.element, options.pinch || temp);

        this.preV = { x: null, y: null };
        this.pinchStartLen = null;
        this.zoom = 1;
        //是否是双击操作
        this.isDoubleTap = false;
        this.tapTimeout = null;
        this.singleTapTimeout = null;
        //长按操作定时器
        this.longTapTimeout = null;
        this.delta = null;
        this.last = null;
        this.now = null;
    };

    Mtouch.prototype = {
        start: function(evt) {
            this.now = Date.now();
            this.delta = this.now - (this.last || this.now);
            this.touchStart.dispatch(evt, this.element);
            this.isDoubleTap = this.delta > 0 && this.delta <= 250 ? true : false;
            this.last = this.now;

            var preV = this.preV;
            var len = evt.touches.length;
            if(len > 1) {
                this._cancelLongTap();
                var v = { x: evt.touches[1].pageX - this.x1, y: evt.touches[1].pageY - this.y1 };
                preV.x = v.x;
                preV.y = v.y;
                this.pinchStartLen = getLen(preV);
                this.multipointStart.dispatch(evt, this.element);
            }

            //判断操作是单击还是长按
            this._preventTap = false;
            this.longTapTimeout = setTimeout(function() {
                this._preventTap = true;
                this.longTap.dispatch(evt, this.element);
            }.bind(this), 750)
        },
        move: function(evt) {
            if (!evt.touches) return;
            var preV = this.preV,
                len = evt.touches.length,
                currentX = evt.touches[0].pageX,
                currentY = evt.touches[0].pageY;
            this.isDoubleTap = false;
            if (len > 1) {
                var sCurrentX = evt.touches[1].pageX,
                    sCurrentY = evt.touches[1].pageY
                var v = { x: evt.touches[1].pageX - currentX, y: evt.touches[1].pageY - currentY };

                if (preV.x !== null) {
                    alert(this.pinchStartLen);
                    if (this.pinchStartLen > 0) {
                        alert(getLen(v));
                        evt.zoom = getLen(v) / this.pinchStartLen;
                        this.pinch.dispatch(evt, this.element);
                    }

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
        end: function(evt) {
            this._cancelLongTap();
            this.touchEnd.dispatch(evt, this.element);
            this.tapTimeout = setTimeout(function() {
                if(!this._preventTap) {
                    this.tap.dispatch(evt, this.element);
                }
                if(this.isDoubleTap) {
                    this.doubleTap.dispatch(evt, this.element);
                    this.isDoubleTap = false;
                }
            }.bind(this), 0)

            if(!this.isDoubleTap) {
                this.singleTapTimeout = setTimeout(function() {
                    this.singleTap.dispatch(evt, this.element);
                }.bind(this), 250)
            }
        },
        //取消长按操作
        _cancelLongTap: function() {
            clearTimeout(this.longTapTimeout);
        }
    };

    window.mtouch = Mtouch;
})(window, undefined);
