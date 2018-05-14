## 一道题

0.1 + 0.2 = ?

在浏览器中测试下计算结果，得到的结果是 **0.30000000000000004**，并不是理想中的 0.3 结果值。为什么会存在这样的误差呢？

## 存在的问题

数值运算会存在精度丢失的问题

## 为什么

想要弄清这个问题，得先了解计算机是何如存储数值的。

1. Number数值会被转换成对应的二进制数值，并用科学计数法表示
2. 把数值通过 IEEE754 的格式表示成存储的计算机内存中的值

javascript 中的 Number 类型值可以是十进制，八进制以及十六进制的数值，在进行算数运算时，所有的八进制和十六进制的数值最终都将会被转换成十进制数值。而对于编程语言来说，所有的程序都会经过解释，编译等操作转换成 CPU 所能识别的语言才能运行，对于 CPU 来说只能识别二进制的数值，所以所有的数值都将会被转换成二进制数值存储的计算机内存中。所以，javascript 在算数运算过程中的顺序应该是这样的，如果存在八进制或者十六进制数值 -> 转换成十进制数值 -> 转换成二进制数值 -> 表示成 IEEE754形式的值存储的内存 中 -> 运算 -> 将结果转成十进制数值。

## IEEE754 标准

IEEE754 标准规定了32位单精度浮点数在计算机存储中表示用1位表示数字的符号，用8位表示指数，用23位来表示尾数，而64位双精度浮点数则是用1位表示数字的符号，用11位表示指数，用52位表示尾数。

在 javascript 中，Number 类型的数值都是双精度64位浮点数，那么就符合 IEEE754 标准的双精度浮点数规则，结构如下：

![IEEE754结构](../assets/q3.png)


从结构图中可以看出，存储的尾数的长度是52位有效数字，二进制的第一位有效数字必定是1，所以这个值不会被存储在64位中，节省了一个存储空间，所以尾数的最长长度应该是53位有效数字。

## 精度丢失

回到刚才的问题，按照正常的流程是会先将 0.1 和 0.2 转换成二进制数值。

![0.1转换二进制](../assets/q1.png)
![0.2转换二进制](../assets/q2.png)

十进制的 0.1 和 0.2 转换成二进制数值都会是无限循环的值
```javascript
0.1 -> 0.0001100110011001...(无限)
0.2 -> 0.0011001100110011...(无限)
```
而根据 IEEE754 标准，尾数最多能存储53位有效数字，那么就必须在特定的位置进行四舍五入处理，得到的结果分别是： 
```javascript
0.1 -> 0.0001100110011001100110011001100110011001100110011001101
0.2 -> 0.001100110011001100110011001100110011001100110011001101
```

所以，相加得到的二进制结果为：
```javascript
0.0001100110011001100110011001100110011001100110011001101 + 
0.001100110011001100110011001100110011001100110011001101 
= 0.0100110011001100110011001100110011001100110011001100111
```
二进制结果转换成十进制就是 0.30000000000000004。

## 小结

数值运算会存在精度丢失的问题的原因是，十进制的数值会先转成二进制数值存储在内存中，但是大多数十进制浮点数转换成二进制是一个无限循环的值，而计算机中存储的二进制值的尾数最多只能53位，那么就会进行四舍五入处理，这样处理的结果就会导致精度丢失。

## 解决方案

既然知道在运算过程中会存在精度丢失的情况导致计算不准确，那么应该如何处理这种问题？

可以在网上搜索一些成熟完善的插件，例如 [mathjs](https://github.com/josdejong/mathjs)。当然在简单的场景下，也可以自己来处理这类问题。

研究过 iview 和 element UI 的 InputNumber 计数器组件源码，大致的解决思路就是，两个数进行相加或者相减运算时，如果两个数中至少一个是小数值，那么就先将这两个数扩大10的n次方倍数进行运算，再将运算结果去除以扩大的倍数，得到最终的结果值，扩大的倍数由小数值的小数位数决定。如果只存在一个小数值，那么n的值就是小数的小数位长度，如果两个值都是小数，那么就先比较下哪个值的小数位长度较长，n的值就取较长的小数位长度。

用 Vue 来实现下这种解决方案。
```html
<div id="app" class="demo">
    <div class="add-main">
        <input type="number" v-model="add_num1"></input> + 
        <input type="number" v-model="add_num2"></input> 
        <i-button type="primary" @click="getReault">计算结果</i-button>
        = {{ result }}
    </div>
</div>
```
```javascript
new Vue({
    el: '#app',
    data: {
        add_num1: 0,
        add_num2: 0,
        result: 0
    },
    methods: {
        toPrecision: function(data, maxPrecision) {
            if (maxPrecision === undefined) maxPrecision = 0;
            return parseFloat(parseFloat(Number(data).toFixed(maxPrecision)));
        },
        getDecimalLen: function(val) {
            return val.toString().split(".")[1] ? val.toString().split(".")[1].length : 0;
        },
        getReault: function() {
            var vm = this;
            var expandPrecision = null;
            var decimal_num1 = vm.getDecimalLen(parseFloat(vm.add_num1));
            var decimal_num2 = vm.getDecimalLen(parseFloat(vm.add_num2));
            let maxPrecision = Math.max(decimal_num1, decimal_num2);
            expandPrecision = Math.pow(10, maxPrecision);
            //简单写法
            // vm.result = (vm.add_num1 * expandPrecision + vm.add_num2 * expandPrecision) / expandPrecision;

            //严谨写法
            vm.result = vm.toPrecision((vm.add_num1 * expandPrecision + vm.add_num2 * expandPrecision) / expandPrecision, maxPrecision);
        }
    }
})
```

这种方案只适用于简单的运用场景，在涉及金额等复杂的运算场景中，最好是选择第三方完善的插件。

## 参考资料

* [从0.1+0.2=0.30000000000000004再看JS中的Number类型](https://juejin.im/post/5a6fce10f265da3e261c3c71)

* [JavaScript 浮点数运算的精度问题](http://www.css88.com/archives/7340)

* [深度剖析0.1 +0.2===0.30000000000000004的原因](https://segmentfault.com/a/1190000011902474)
