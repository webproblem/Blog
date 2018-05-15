## Set 

* 说明
    * Set 是一种数据结构，类似于数组，Set 成员是唯一性，没有重复的成员值。
    * Set 本身是个构造函数，在实例化的时候可以将数组或者具有 iterable 接口的其他数据结构作为参数传入。
    * Set 避免了 NaN !== NaN 的情况，确保了成员的唯一性。
    * Set 结构没有键名，或者说键名和键值都是同一个值。

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
    * Set 结构转换成数组
    ```javascript
        const array = [1,6,3,'a','b','c'];
        Array.from(new Set(array)); //[1, 6, 3, "a", "b", "c"]
    ```
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
    * 成员只能是对象。
    * 不能进行遍历。
    * WeakSet 本身是个构造函数，在实例化的时候可以将数组或者具有 iterable 接口的其他数据结构作为参数传入。

* API
    * add
    * delete
    * has    

