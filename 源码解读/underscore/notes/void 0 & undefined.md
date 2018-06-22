## void 0 vs undefined

* underscore 源码中使用 void 0 代替了 undefined

* undefined 存在的缺陷

    * 在 ECMAScript 中，undefined 并不是保留字
    * 全局的 undefined 在 ECMA5 版本之前是可以被重写的，即便在 ECMA5 中，全局的 undefined 作为一个只读属性，但是局部作用域中的 undefined 也会被重写，也就是 undefined 很容易被污染
    ```javascript
        // IE < 9
        undefined = 10;
        console.log(undefined); // 10

        // 局部作用域中重写
        function test() {
            var undefined = 10;
            console.log(undefined);
        }
        test(); // 10
    ```

* void

    * void 是保留字，不能被重写
    * void 会执行后面的表达式并总是返回 undefined，void 0 === undefined

* 参考
    * [https://stackoverflow.com/questions/5716976/javascript-undefined-vs-void-0](https://stackoverflow.com/questions/5716976/javascript-undefined-vs-void-0) 

    * [https://stackoverflow.com/questions/7452341/what-does-void-0-mean](https://stackoverflow.com/questions/7452341/what-does-void-0-mean)

    * [https://github.com/hanzichi/underscore-analysis/issues/1](https://github.com/hanzichi/underscore-analysis/issues/1)   