### [1,2,3].map(parseInt); 值是多少？

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

