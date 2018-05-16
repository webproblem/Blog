## Set 

* 说明
    * Set 是一种数据结构，类似于数组，Set 成员是唯一性，没有重复的成员值
    * Set 本身是个构造函数，在实例化的时候可以将数组或者具有 iterable 接口的其他数据结构作为参数传入
    * Set 避免了 NaN !== NaN 的情况，确保了成员的唯一性
    * Set 结构没有键名，或者说键名和键值都是同一个值

* API
    * 属性
        * size
        * constructor
    * 方法
        * 操作方法
            * add
            * delete
            * has
            * clear
        * 遍历方法
            * keys
            * values
            * entries
            * forEach 

* 应用
    * 数组去重
    ```javascript
        //方法一
        const array = [1,2,6,7,'a','b','c','d',2,6,'c'];
        [...new Set(array)]; //[1, 2, 6, 7, "a", "b", "c", "d"]

        //方法二
        const array = [1,2,6,7,'a','b','c','d',2,6,'c'];
        Array.from(new Set(array)); //[1, 2, 6, 7, "a", "b", "c", "d"]
    ```

## WeakSet

* 说明
    * 成员只能是对象
    * 不能进行遍历
    * 没有 size 属性
    * WeakSet 本身是个构造函数，在实例化的时候可以将数组或者具有 iterable 接口的其他数据结构作为参数传入
    * WeakSet 的引入不会计入垃圾回收机制

* API
    * add
    * delete
    * has    


## Map

* Object 对象实际上也是 Hash 结构，但是一般键名都是是字符串，而 Map 集合的键可以是其他数据类型
* Map 接收数组或者具有 iterable 接口的其他数据结构作为参数，参数为数组的时候，数组的成员（不是数组本身）将会转为 Map 成员，数组成员只需要两个值，第一个值作为键，第二个值作为值
* Map 的键是和内存地址绑定的，只要键的内存地址不一样，都会被认定是不同的键

* API
    * 属性
        * size
    * 方法    
        * 操作方法
            * set
            * get
            * has
            * delete
            * clear
        * 遍历方法
            * keys
            * values
            * entries
            * forEach

* 应用
    * 数据转换

* 例子
    ```javascript
    // object 对象使用其他数据类型作为键名
    // 获取值很不方便
    const obj = Object.create(null);
    const o = {name: '白展堂'};
    obj[o] = '吕秀才'; //obj => {[object Object]: "吕秀才"}
    console.log(obj['[object Object]']) //吕秀才 
    ```

## WeakMap

* 不能进行遍历
* 没有 size 属性
* 只接受对象作为键名                

* API
    * set
    * get
    * has
    * delete


## 参考

[ES5对象与ES6 Maps的异同](https://www.zcfy.cc/article/es5-objects-vs-es6-maps-8211-the-differences-and-similarities-appendto-web-development-training-courses-for-teams-795.html)