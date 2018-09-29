function Dep() {
    this.subs = {};
}
Dep.prototype = {
    addSub: function(msg, sub) {
        this.subs[msg] = this.subs[msg] || [];
        this.subs[msg].push(sub);
    },
    notify: function(msg) {
        this.subs[msg] = this.subs[msg] || [];
        for(var i=0, len = this.subs[msg].length; i<len; i++) {
            this.subs[msg][i].apply(this, arguments);
        }
    }
};

function Watcher(uid, binder) {
    var data_attr = 'data-bind-' + uid;
    var message = uid + ':change';
    var changeHandler = function(event) {
        var target = event.target;
        var prop_name = target.getAttribute(data_attr);

        if(prop_name && prop_name.length > 0) {
            binder.notify(message, prop_name, target.value);
        }
    }
    document.addEventListener('input', changeHandler);

    binder.addSub(message, function(message, prop_name, new_val) {
        var elements = document.querySelectorAll('['+data_attr+' = '+prop_name+']');
        var tag_name = null;
        for(var i=0; i<elements.length; i++) {
            tag_name = elements[i].tagName.toLowerCase();
            if(tag_name === 'input' || tag_name === 'textarea') {
                elements[i].value = new_val;
            }else {
                elements[i].innerHTML = new_val;
            }
        }
    })
}

function MVVM(uid) {
    this.uid = uid;
    this.attriures = {};
    this.binder = new Dep();
    Watcher(this.uid, this.binder);
    this.init();
}
MVVM.prototype = {
    init: function() {
        var that = this;
        that.binder.addSub(this.uid + ':change', function(message, attr, new_val, initiator) {
            if(initiator !== that) {
                that.set(attr, new_val);
            }
        })
    },
    set: function(attr, value) {
        this.attriures[attr] = value;
        this.binder.notify(this.uid+ ":change", attr, value, this);
    },
    get: function(attr) {
        return this.attriures[attr];
    }
}