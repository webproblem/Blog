## 面试知识点详解 - JavaScript 部分

### 1. [1,2,3].map(parseInt); 值是多少？

> ### 解答

#### parseInt

* parseInt 函数的作用是解析一个字符串，并返回一个指定基数的十进制正数。

* parseInt 函数接收两个参数
    * string: 要解析的字符串，如果 string 参数不是字符串类型，会在解析之前自动转换成字符串。
    * radix: 解析时指定的基数，范围限制在 2-36 之间的整数，设置的值其实就是一种进制表示，作用其实就是根据值把 string 参数值当做一种进制数看待，比如 string 参数的值是 6，radix 参数的值为 16，表达的意思就是把 6 看作成是 十六进制数去解析成十进制的整数并最终返回。
    ```javascript
    parseInt('10', 16) // 将 '10' 当做 16 进制数来解析，16 进制的 10 转换成 10 进制，结果是 16。
    ```
* parseInt 函数在以下情况会返回 NaN
    * string 参数解析失败，就是进制间转换失败或者不能成功。
    * radix 参数值不在 2-36 整数范围。

#### map

* map 是数组迭代函数，接收一个匿名函数作为参数，函数中又接收三个参数，分别是: value 数组元素，index 元素下标，array 数组本身。

* parseInt 函数作为 map 的参数，由于 parseInt 函数只接收两个参数，JS 执行过程中，会将 map 匿名函数中的前面两个参数传递给 parseInt 函数，也就是将 value 和 index 参数传递出去。
    ```javascript
    function parseInt (string, radix) {
        return string + '-' + radix;
    }
    [1,2,3].map(parseInt); // ["1-0", "2-1", "3-2"]
    ```
    例子中，重写了 parseInt 函数。可以看到 [1,2,3].map(parseInt) 执行的时候，是将 index 元素下标作为 parseInt 函数的第二个参数也就是指定的基数，那么再执行的时候，[1,2,3].map(parseInt) 相当于下面的写法。

    ```javascript
    parseInt('1', 0); // 十进制数 '1' 解析成十进制，结果为 1
    parseInt('2', 1); // radix 参数的范围不在 2-36 之间，结果为 NaN
    parseInt('3', 2); // 二进制数 '3' 是不存在的，不是合法的二进制数，解析失败，结果为 NaN
    ```
所以最终的结果为 [1, NaN, NaN]。


#### 参考

* [https://segmentfault.com/a/1190000000411840](https://segmentfault.com/a/1190000000411840)  

------------------------------------------------------------------

### 2. var arr = ['a', 'b', 'c', 'd', 'c']; 实现数组乱序

> ### 解答

首先，通过题目可以看出，可能存在一个小陷阱，数组中存在两个 'c' 元素，我想这并不是面试官或者出题人无意打错字，可能是想顺便考察下面试者对数组去重的掌握情况。当然了，这个小细节也可以忽略直接进入实现乱序功能。

对于有代码洁癖的开发人员来说，是不允许自己的程序中出现相同的元素数组值的，所以我们先把数组去重好了。

```javascript
// 数组去重
arr = [...new Set(arr)]; // ["a", "b", "c", "d"]
```

好了，下面开始思考如何实现数组乱序了。

#### sort 排序

常见的一种实现方案就是使用数组的 sort 排序方法，原理就是 sort 的 compareFunction 匿名函数的返回值小于 0 则升序排列，大于 0 则降序排列，由于 Math.random() 得到的是 0-1 区间的数，Math.random() - 0.5 有 50% 的概率大于 0，50% 的概率小于 0。

```javascript
function shuffle(arr) {
    return arr.concat().sort(function() {
        return Math.random() - 0.5;
    })
}
```

但是这并不是最好的解决方案，sort 排序存在的问题就是元素位置概率不均，某个元素排序后位置不变或者调换在相邻位置的概率更高，测试如下：

```javascript
var count = new Array(7).fill(0);

for(var i=0; i<10000; i++) {
    var arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
    arr = shuffle(arr);
    count[arr.indexOf('a')]++;
}

console.log(count); // 一次随机乱序排序的结果 => [3033, 2927, 1899, 1143, 585, 284, 129]
```

测试进行了 10000 次的乱序排序，可以看出 'a' 元素出现在第一个位置的次数远高于出现在其他位置的次数，也就是说本应当出现在每个位置的次数应该是差不多的，实际上却差别很大，这种差异大或者不公平的结果的出现，说明 sort 排序并不是一个很好的解决方案。

至于这种差异大的原因，简单说是因为 v8 底层对 sort 的实现方式导致。v8 在处理 sort 方法时，当目标数组长度小于 10，使用的是插入排序，反之使用的是快速排序和插入排序的混合排序。

#### Fisher–Yates shuffle

数组乱序最优的解决方案应该是使用 Fisher–Yates shuffle 算法。原理就是，遍历数组元素时，将当前元素随机与另一个数组元素的位置进行互换，直到遍历结束。underscore 工具库中对数组的乱序也是使用了该方案。

基本实现如下：

```javascript
function shuffle(arr) {
    var rand, temp;
    for(var i=0; i<arr.length; i++) {
    	rand = Math.floor(Math.random() * (i + 1));
        temp = arr[i];
        arr[i] = arr[rand];
        arr[rand] = temp;
    }
    return arr;
}
```

再来测试这个方案的效果：

```javascript
var count = new Array(7).fill(0);

for(var i=0; i<10000; i++) {
    var arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
    arr = shuffle(arr);
    count[arr.indexOf('b')]++;
}
console.log(count); // 一次随机乱序排序的结果 => [1397, 1464, 1448, 1434, 1444, 1400, 1413]
```

可以看到 10000 次的乱序后，出现在其他位置上的次数差异不是很大，且时间复杂度也是比较优的。

#### 其他实现方案

可能不是最优的方案。

```javascript
function shuffle(arr) {
    var newArr = [], rand;
    arr = arr.concat();
    while(arr.length) {
        rand = Math.floor(Math.random() * arr.length);
        newArr.push(arr[rand]);
        arr.splice(rand, 1);
    }
    return newArr;
}
```

#### 参考

* https://github.com/mqyqingfeng/Blog/issues/51
* https://github.com/hanzichi/underscore-analysis/issues/15
* https://blog.oldj.net/2017/01/23/shuffle-an-array-in-javascript/

--------------------------------------------------------------------------------------------------

### 3. var arr = ['a', 'b', 'c', 'd', 'c']; 实现数组倒序(非 reverse)

> ### 解答

题目规定了不能使用数组原生 reverse 方法，也就是想让面试者模拟实现 reverse 倒序的功能。

```javascript
// 数组去重
arr = [...new Set(arr)]; // ["a", "b", "c", "d"]

// 方案一
// sort 匿名函数返回值大于 0，降序排序
function reverse(arr) {
    return arr.concat().sort(function() {
        return 1;
    })
}

// 方案二
// 遍历数组，将数组元素倒序插入新数组中
function reverse(arr) {
    var newArr = [];
    for(var i=0; i<arr.length; i++) {
        newArr.unshift(arr[i]);
    }
    return newArr;
}

// 方案三
// 原理就是以数组中间的元素为基准，左右两边的元素互换位置
// 也就是下标 0 的元素和下标是 arr.length-1 的元素换位置，
// 下标 1 的元素和下标是 arr.length-2 的元素换位置，以此类推
function reverse(arr) {
    var len = arr.length;
    var last = len - 1;
  	var temp;
    for(var i=0; i<Math.floor(len / 2); i++) {
        temp = arr[i];
        arr[i] = arr[last - i];
        arr[last - i] = temp;
    }
    return arr;
}
```
--------------------------------------------------------------

### 4. 如何判断两个对象相等

> ### 解答

首先要清楚 JavaScript 中的相等分为宽松相等（==）和严格相等（===）。宽松相等在比较值的时候会先进行类型的隐式转换，严格相等下如果比较值的类型不一致，那么就判定比较值不全等。如果比较值是引用类型，宽松相等和严格相等就不能判断出值是否相等了（引用类型浅拷贝比较值除外，也就是比较值指向的是同一引用地址），原因是对于任意两个不同的非原始对象，即便他们有相同的结构，都会计算得到 false 。

```javascript
var num = 1;
var str = '1';
console.log(num == str); // true
console.log(num === str); // false

var obj1 = {name: '白展堂'};
var obj2 = {name: '白展堂'};
var obj3 = obj1;
console.log(obj1 == obj2); // false
console.log(obj1 === obj2); // false
console.log(obj1 == obj3); // true
console.log(obj1 === obj3); // true

var arr1 = [1];
var arr2 = [1];
console.log(arr1 == arr2); // false
console.log(arr1 === arr2); // false
```

#### JSON.stringify

如何判断对象是否相等？

一种解决方案就是使用 JSON.stringify 序列化成字符串再做比较。

```javascript
var obj1 = {name: '白展堂', age: 25};
var obj2 = {name: '白展堂', age: 25};
JSON.stringify(obj1) === JSON.stringify(obj2); // true

var arr1 = ['a', 'b', 'c', 'd'];
var arr2 = ['a', 'b', 'c', 'd'];
JSON.stringify(arr1) === JSON.stringify(arr2); // true
```

这种方案看似可以判断出对象是否相等，但是会不会存在问题呢？看过 underscore 源码的都知道，isEqual 函数的实现有多复杂，很多种情况显然不是通过 JSON.stringify 序列化就能解决的。

先来分析下 JSON.stringify 方案存在的问题，假设比较对象中的属性值存在 RegExp 对象，判定结果是怎样的呢？

```javascript
function eq(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
}
var obj1 = {name: '白展堂', reg: /test1/i};
var obj2 = {name: '白展堂', reg: /test2/i};
eq(obj1, obj2); // true
```

结果为 true，也就是说 obj1 和 obj2 序列化的字符串是一致的。

```javascript
var obj1 = {name: '白展堂', reg: /test1/i};
var obj2 = {name: '白展堂', reg: /test2/i};
JSON.stringify(obj1); // "{"name":"白展堂","reg":{}}"
JSON.stringify(obj2); // "{"name":"白展堂","reg":{}}"
```

可以看到，JSON.stringify 将 RegExp 对象序列化成了 '{}'，也就是说 JSON.stringify 序列化对于某些情况会存在问题，比如 undefined 和 Function 函数在序列化过程中会被忽略。

```javascript
function test() {}
JSON.stringify(undefined) === JSON.stringify(test); // true
```

#### 实现

那么如何完美的判断对象或值相等，可以读下 underscore 中的 isEqual 函数源码，这里说下大致思路。

**区分 0 与 -0 之间的差异**

0 与 -0 看似相等吗，其实不然。

```javascript
1 / 0 // Infinity
1 / -0 // -Infinity
1 / 0 === 1 / -0 // false
```

区分方式：

```javascript
function eq(a, b) {
    if(a === b) {
        return a !== 0 || 1 / a === 1 / b; 
    }
    return false;
}
eq(0, 0); // true
eq(0, -0); // false
```

**判断值是否为 NaN**

判断某个值是否为 NaN 时不能直接比较这个值是否等于 NaN，因为 NaN 不等于自身，可以使用原生函数 Number.isNaN() 或 isNaN()。

```javascript
var a = NaN;
a === NaN; // false
isNaN(a); // true
```

那么自己如何实现判断 NaN 值的方法？利用 NaN 不等于自身的原理。

```javascript
function eq(a, b) {
    if(a !== a) return b !== b; 
}
eq(NaN, NaN); //true
eq(NaN, 'test'); // false
```

**隐式类型转换**

对于 RegExp，String，Number，Boolean 等值的比较先进行隐式类型转换。

**递归遍历**

对于数组和对象的比较值，采用递归遍历比较，需要注意的是可能存在循环引用的问题。

#### 参考

* https://blog.csdn.net/qq_30100043/article/details/53419801
* https://github.com/mqyqingfeng/Blog/issues/41
* https://github.com/hanzichi/underscore-analysis/issues/5
* https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Equality_comparisons_and_sameness
* https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify

------------------------------------------------------------------------------------------------

### 5. 如何判断一个变量是数组还是对象

> ### 解答

这里主要考察的是对类型判断的掌握。

#### typeof

typeof 操作符会返回字符串形式的数据类型。JavaScript 有 6 中基本数据类型（Undefined, Null, String, Number, Boolean, Symbol）和 1 种引用类型（Object），使用 typeof 操作符对这些数据类型操作时，返回的结果分别是：undefined, object, string, number, boolean, symbol, object。Null 类型的变量通过 typeof 操作符得到的结果是 object，也就是说 typeof 操作符判断类型并不准确，同样的如： Date, RegExp, Array 等类型。

```javascript
var a = null;
typeof a; // object

var arr = [];
typeof arr; // object

var date = new Date();
typeof date; // object
```

#### Object.prototype.toString

另一种完美的解决方案是 Object.prototype.toString！通过 toString 来获取数据的类型，需要以 call 或者 apply 的方式来调用对数据进行检测，返回的结果是由 [object, class] 组成的。关于该方法的具体描述，参考：<https://es5.github.io/#x15.2.4.2> 。

```javascript
var toString = Object.prototype.toString;
toString.call(null); // [object Null]
toString.call([]); // [object Array] 
toString.call(new Date()); // [object Date]
```

那么如何来封装一个判断变量类型的函数

```javascript
/**
 * @param obj   需要判断类型的变量
 * @param type  判断的类型
*/
function type(obj, type) {
    var classType = {};
    var result = null;
    ['Function', 'Array', 'Date', 'RegExp', 'Object', 'Error'].map(function(item) {
        classType['[object '+item+']'] = item.toLowerCase();
    })
    result = typeof obj === 'function' || typeof obj === 'object' ? classType[Object.prototype.toString.call(obj)] : typeof obj;
    return result === type;
}

type([], 'array'); // true
type([], 'object'); // false
```

#### 参考

* https://github.com/mqyqingfeng/Blog/issues/28

--------------------------------------------------------------------------------

