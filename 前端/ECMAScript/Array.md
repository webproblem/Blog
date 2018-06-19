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
    * push
    * pop
    * unshift
    * shift
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
    * splice

* 访问方法
    * concat
    * includes
    * join
    * slice
    * toSource
    * toString
    * toLocaleString
    * indexOf
    * lastIndexOf

* 迭代方法
    * forEach
    * entries
    * every
    * some
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