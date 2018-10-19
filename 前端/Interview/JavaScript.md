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

-----------------------------------------------------------------------

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
-----------------------------------------------------------------------





