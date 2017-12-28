;(function (window, undefined) {
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
    };

    Mtouch.prototype = {
        start: function(evt) {
            this.touchStart.dispatch(evt, this.element);
        },
        move: function(evt) {
            this.touchMove.dispatch(evt, this.element);
        },
        end: function(evt) {
            this.touchEnd.dispatch(evt, this.element);
        }
    };

    window.mtouch = Mtouch;
})(window, undefined);
