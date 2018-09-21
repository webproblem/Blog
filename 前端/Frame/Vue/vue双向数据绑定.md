## Vue 双向数据绑定

Vue 双向数据绑定实现的核心是 Object.defineProperty 对属性的劫持，当数据变动时，Object.defineProperty 会劫持到数据的变化并通知到订阅者，触发相应的操作。

## 实现思路

* 实现一个 Observer 数据监听器，通过使用 Object.defineProperty 对所有属性进行劫持监听，数据变动时通知订阅者。

* 实现一个 Compile 指令解析器，对每个元素上的指令进行解析，对数据进行初始化绑定。

* 实现一个 Watcher 订阅器，作为 Observer 和 Compile 之间的桥梁，

![image](https://user-images.githubusercontent.com/20440496/42452395-6eb0219a-83bc-11e8-90e8-6571ef756f27.png)