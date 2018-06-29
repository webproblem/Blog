## Array

* 修改器方法
    * copyWithin: 从数组的指定位置拷贝元素到数组中的另一个指定位置
        ```javascript
            ['a','b','c','d','e','f','g'].copyWithin(1,2,3);
            // ['a','c','c','d','e','f','g']

            [1,2,3,4,5].copyWithin(3,1);
            // [1,2,3,2,3]
        ```
    * fill: 用一个固定值填充数组的元素
    * push: 从数组尾部添加元素
    * pop: 从数组尾部删除元素
    * unshift: 从数组头部添加元素
    * shift: 从数组尾部删除元素
    * sort: 对数组的元素进行排序，默认排序顺序是根据字符串Unicode码点
        ```javascript
            [10,9,80].sort();
            // [10, 80, 9]

            ['color', 'width', 'height', 'background'].sort();
            // ['background', 'color', 'height', 'width']

            [10,9,80].sort(function(a,b) {
                return a - b;
            })        
            // [9, 10, 80]
        ```
    * reverse
    * splice: 向数组添加或删除元素
        ```javascript
        var arr = [0,1,2,3];
        arr.splice(1,1); // [0,2,3]
        arr.splice(1,0,'添加的元素'); // [0, '添加的元素', 2, 3]
        ```

* 访问方法
    * concat: 合并数组，数组浅拷贝
        ```javascript
        // 另一种数组合并的方式，这种方式每次只能合并两个数组，并且会改变原有数组的值。
        // 这种方式的作用其实是将一个数组的元素追加到另一个数组里。
        var arr1 = [0, 1, 2];
        var arr2 = [3, 4, 5];
        var arr3 = [6,7,8];
        
        Array.prototype.push.apply(arr1, arr2, arr3);
        console.log(arr1); // [0,1,2,3,4,5]
        ```
    * includes
    * join
    * slice: 截取数组元素，数组浅拷贝
    * toSource
    * toString
    * toLocaleString
    * indexOf
    * lastIndexOf

* 迭代方法
    * forEach
        ```javascript
        // break 和 return 是不能中断 forEach 循环的，除非抛出异常，但是这样做是错误的使用 forEach。
        // 对于需要在循环中中断循环操作的，可以使用 smoe 或 every。
        var arr = [1,67,54,87,103,77,66];
        try {
            arr.forEach(function(value) {
                console.log(value);
                if(value == 103) {
                    throw BreakException;
                }
            })
        }catch(e) {}
        ```
    * entries
    * every: 检测数组的所有元素是否通过了回调函数的测试
        ```javascript
        // every 方法会遍历数组中的所有元素，在回调函数中执行操作，直到遇到 return false 才会停止遍历数组，否则数组全部遍历完之后最终的结果会 return true。
        var arr = [1,67,54,87,103,77,66];
        arr.every(function(value, index, array) {
            console.log(index); // 0 1 2 3 4
            // 遍历到第5个数组元素时，值大于 100， return falae 后遍历终止
            return value < 100;
        })
        ```
    * some: 检查数组中是否存在能通过回调函数测试的元素
        ```javascript
        // some 方法会遍历数组中的所有元素，在回调函数中执行操作，知道 return true 才会停止遍历数组，否则数组全部遍历完之后最终的结果会 return false。
        
        // 可以发现， some 方法和 every 方法的返回值取值是相反的，every 方法是只有当数组中的所有元素返回 true，最终的结果才为 true，而 some 方法则是只要有一个数组元素能成功返回 true，最终的结果就为 true。类似于运算符中的 "&" 和 "||" 的关系。
        var arr = [1,67,54,87,103,77,66];
        arr.some(function(value, index, array) {
            console.log(index); // 0 1 2 3 4
            return value > 100;
        })
        ```
    * filter
    * map
    * reduce

## 数组操作技巧

* 数组去重

```javascript
var array = ['a','b','c','d','a','c','e','f','g','b'];
//方法一
[...new Set(array)];
//方法二
function removeDuplicatedItem(arr) {
    var obj = {};
    var temp = [];
    for(var i=0; i<arr.length; i++) {
        if(!obj[arr[i]]) {
            temp.push(arr[i]);
            obj[arr[i]] = true;
        }
    }
    return temp;
}
removeDuplicatedItem(array);
//方法三
function removeSortItem(arr) {
    arr.sort();
    var temp = [arr[0]];
    for(var i=0; i<arr.length; i++) {
        if(arr[i] !== temp[temp.length - 1]) {
            temp.push(arr[i]);
        }
    }
    return temp;
}
removeSortItem(array);
//方法四
function removeIndexItem(arr) {
    var temp = [];
    for(var i=0; i<arr.length; i++) {
        if(temp.indexOf(arr[i]) === -1) {
            temp.push(arr[i]);
        }
    }
    return temp;
}
removeIndexItem(array);
```        

* 数组clone

* 查找一个字符串中出现次数最多的字符，统计这个次数
```javascript
const strings = 'abdndndfdfjdkfsfjhfdffresf';
const timesObj = strings.split('').reduce((obj, value) => {
    if(obj[value]) {
        obj[value]++;
    }else {
        obj[value] = 1;
    }
    return obj;
}, {})
let times = 0, chart = '';
Object.keys(timesObj).forEach((key) => {
    if(timesObj[key] > times) {
        times = timesObj[key];
        chart = key;
    }
})
console.log(`${chart}: ${timesObj[chart]}`);
```

* 找出数组中最大值
```javascript
//方法一
const array = [1,7,453,51,545,665,546,763,687,786];
Math.max.apply(Math,array);
//方法二
array.sort((a, b) => {
    return b - a;
})
array[0];
```

* 数组排序

* 找出数组中唯一的值
```javascript
const array = [1,1,3,5,4,7,6,4,6,3,5,2];
array.filter(item => array.indexOf(item) === array.lastIndexOf(item));
```

## 参考

* [https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array)