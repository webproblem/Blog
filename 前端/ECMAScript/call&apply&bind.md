## call, apply, bind

### call

call 方法的作用是改变函数运行时的上下文，也就是改变函数运行时 this 的指向。

call 方法接受多个参数，第一个参数是指定的 this 指向，非严格模式下，第一个参数为 null 或者 undefined 时，函数内部的 this 指向 window 全局对象或所在执行环境的顶级对象。后面的参数表示要传入函数内部的参数列表。

```javascript
var foo = {
    color: 'blue'
}
function bar(name) {
    console.log(name + this.color);
}
// 改变 bar 函数内部的 this 指向，指向 foo 对象
bar.call(foo, '天空的颜色'); // 天空的颜色blue
```

**call 在继承中的应用。**

```javascript
function Super(address, work) {
    this.address = address;
    this.work = work;
}
function SubA(name, address, work) {
    Super.call(this, address, work);
    this.name = name;
    this.say = function() {
        console.log(`${this.name}居住${this.address}，工作岗位是${this.work}`);
    }
}

var personA = new SubA('白展堂', '七侠镇同福客栈', '跑堂');
personA.say(); // 白展堂居住七侠镇同福客栈，工作岗位是跑堂

var personB = new SubA('燕小六', '七侠镇衙门', '捕快');
personB.say(); // 燕小六居住七侠镇衙门，工作岗位是捕快
```

**call 的实现**

注意点：

* call 方法的第一个参数可以是 null 或 undefined，也就是可以指向顶级对象（这里只考虑 window）。
* 后面的参数都是传入到函数内部的参数列表，使用 arguments 来处理。
* 考虑将要执行的函数转化到 this 想要指向的对象上，函数执行完之后再将属性删除。

```javascript
Function.prototype.simCall = function(context) {
    var result = null, args = [];
    context = context || window;
    // 获取调用 simCall 方法的函数并向 context 对象添加 fn 属性，this 的指向就是调用函数
    // bar.simCall(foo, '天空的颜色'); => foo.fn = bar
    // foo = {
    //     color: 'blue',
    //     fn: bar
    // }
    context.fn = this;
    // 获取调用 simCall 方法时，传入的参数列表
    // args => [arguments[1], arguments[2], arguments[3], ...]
    for(var i = 1; i<arguments.length; i++) {
        args.push('arguments['+i+']');
    }
    // eval 执行函数
    // 相当于 context.fn(arguments[1], arguments[2], arguments[3], ...);
    result = eval('context.fn('+args+')');
    // 删除添加的 fn 属性
    delete context.fn;
    // 返回执行函数的返回值
    return result;
}
```

```javascript
// es6 版本
Function.prototype.simCall = function(context) {
    let result = null, args = null;
    context = context || window;
    context.fn = this;
    args = [...arguments].slice(1);
    result = context.fn(...args);
    delete context.fn;
    return result;
}
```

测试

```javascript
// 将 arguments 伪数组转换成数组
function test() {
    var args = Array.prototype.slice.simCall(arguments);
    console.log(args);
}
test('a', 'b', 'c'); // ["a", "b", "c"]
```

### apply

apply 方法的功能和 call 方法相同，只是接受的参数不同。apply 方法接受的参数除了指定的 this 指向，另一个参数是一个数组或类数组对象。

**call 比 apply 速度快**

需要知道的是，使用 call 比 apply 的速度更快，性能更好。原因是 apply 方法执行过程中对参数的处理更为复杂，需要进行检测数组参数和格式化等步骤，而 call 方式的参数原本就是按照顺序排列的参数列表，处理步骤更为简洁。

underscore 源码中也是尽量使用 call 代理 apply。在处理迭代时，参数少于4个的函数，就使用 call 方法，参数超过3个的函数，使用 arguments 伪类数组承载参数并结合 apply 方法。需要注意的是当一个函数的形参超过3个的时候，可能就要考虑对函数的重构了。

**apply 的实现**

```javascript
Function.prototype.simApply = function(context, arr) {
    let result = null;
    context = context || window;
    context.fn = this;
    if(!arr) {
        result = context.fn();
    }else {
        result = context.fn(...arr);
    }
    delete context.fn;
    return result;
}
```

### bind

bind 方法会创建一个新的函数，称为绑定函数。bind 方法接受多个参数，第一个参数和其余参数分别是 this 指向和实参之前传入给绑定函数的参数列表。

与 call, apply 不同的是，调用 bind 方法之后，还需要再执行绑定函数，也就是多了一个步骤。

bind 方法创建的绑定函数当做构造函数时，也就是使用 new 来修饰绑定函数，那么传入的 this 指向将失效，其他参数依旧有效。

且连续调用 bind 方法是无效的，最终只会取第一个调用 bind 方法的结果。

```javascript
var objA = {
    color: 'blue'
}
var objB = {
    color: 'red'
}
var objC = {
    color: 'black'
}
function bar(name) {
    console.log(name + this.color);
}

var func = bar.bind(objA, '天空的颜色').bind(objB, '苹果的颜色').bind(objC, '乌云的颜色');
func(); // 天空的颜色blue
```

**bind 的实现**

```javascript
Function.prototype.simBind = function(context) {
    if(typeof this !== 'function') {
        throw new TypeError('类型错误');
    }
    var fn = this;
    var args = Array.prototype.slice.call(arguments, 1);
    var fBound = function () {
        var bindArgs = Array.prototype.slice.call(arguments);
        if(this instanceof bound) {
            return fn.apply(this, args.concat(bindArgs));
        }else {
            return fn.apply(context, args.concat(bindArgs));
        }
    }
    fBound.prototype = this.prototype;
    return fBound;
}
```

### 应用

#### 数组追加

```javascript
var arrayA = ['test', 'javascript', 333];
var arrayB = ['a', 'b', 'c', 'd'];

Array.prototype.push.apply(arrayA, arrayB);
console.log(arrayA); // ["test", "javascript", 333, "a", "b", "c", "d"]
```

#### 获取最大值，最小值

```javascript
var numbers = [10, 545, 676, 34, 6476, 678];
// 获取最大值
Math.max.apply(null, numbers); // 6476
Math.max.call(null, 10, 545, 676, 34, 6476, 678); // 6476
// 获取最小值
Math.min.apply(null, numbers); // 10
Math.max.call(null, 10, 545, 676, 34, 6476, 678); // 10
```

#### 伪数组转换成数组

```javascript
var fakeArr = {
    0: 'a',
    1: 'b',
    2: 'c',
    length: 3
};

Array.prototype.slice.call(fakeArr); // ["a", "b", "c"]
```

### 总结

* call 和 apply 的功能是相同的，只是传入的参数形式不同。
* call 比 apply 的性能更优。
* bind 方法要多执行绑定函数的步骤。

### 参考

* https://github.com/mqyqingfeng/Blog/issues/11
* https://github.com/mqyqingfeng/Blog/issues/12
* https://www.cnblogs.com/coco1s/p/4833199.html
* https://lz5z.com/call-faster-than-apply