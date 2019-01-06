## Vue 双向数据绑定

### 什么是双向数据绑定

双向数据绑定是对 MVVM 中的 viewModel 的实现，简单说就是数据驱动视图，视图修改数据。视图与数据分离解耦，视图的显示状态和数据保持一致，视图的修改会同步更新数据，数据的变化也会同步更新视图的显示状态。

### 双向数据绑定的实现方式

1. 观察者模式

   观察者模式其实是定义的一种一对多的依赖关系，由主体和订阅者组成，主体发布订阅消息，所有依赖于该主体的订阅者都将得到通知，当然订阅者也可以取消对主体的订阅。这就类似于微信公众号，主体是公众号，用户是订阅者，当公众号推送消息时，所有关注了公众号的用户都将看到推送的消息。

   观察者模式的实现大致是这样：定义一个主体类，然后在主体类上添加收集订阅者，删除订阅者，发布消息等方法，通过维护一个数组来依赖收集订阅者，当发布消息的时候，遍历订阅者数组一一通知。

   在开源的移动端手势库AlloyFinger中，就使用到了观察者模式来收集所有的手势操作。

   关于[观察者模式](https://github.com/webproblem/Blog/blob/master/%E5%89%8D%E7%AB%AF/ECMAScript/%E8%A7%82%E5%AF%9F%E8%80%85%E6%A8%A1%E5%BC%8F.md)

2. AngularJs 脏值检查

   AngularJs 就是通过脏值检查的机制来对比前后数据是否一致，以此来觉得是否更新视图，大致就是记录下所有变量的当前值，当发生某些操作的时候，进入到脏值检查的环节，对比最近一次的值和现在的值是否一致，不一致就更新视图。

   angular只有在指定的事件触发时进入脏值检测，大致如下：

   DOM事件、XHR响应事件、延迟事件等

3. VueJs 观察者模式+数据劫持

   数据劫持主要是通过ES5的Object.defineProperty进行属性劫持，监听数据变动，通过存取描述符（另一种是数据描述符）getter和setter可以观察到对象属性的读取和赋值。当数据变动时，Object.defineProperty 会劫持到数据的变化并通知到订阅者，触发相应的操作。

## 实现思路

首先思考几个问题：

1. 如何知道Model的数据变化
2. Model数据变化如何通知视图更新，也就是model => view 的变化 
3. 视图的修改如何通知Model数据更新，也就是view => model的变化

* 实现一个 Observer 数据监听器，通过使用 Object.defineProperty 对所有属性进行劫持监听，数据变动时通知订阅者。

* 实现一个 Compile 指令解析器，对每个元素上的指令进行解析，对数据进行初始化绑定。

* 实现一个 Watcher 订阅器，作为 Observer 和 Compile 之间的桥梁，

![image](https://user-images.githubusercontent.com/20440496/42452395-6eb0219a-83bc-11e8-90e8-6571ef756f27.png)

第一步：可以通过Object.defineProperty对属性进行劫持监听，可以观察到数据的变化，也就是实现一个数据监听器Observer函数，Observer函数接受的参数就是new Vue构造函数时传入的data选项。函数内部通过递归遍历，取出所有的属性，然后通过对所有属性的劫持来观察数据的变化，可以再封装一个defineReactive函数来劫持属性监听数据。

第二步：实现一个消息订阅主体Dep，主要用来收集订阅者。这里涉及到了一个知识点：依赖收集，为什么需要依赖收集：因为可能存在data选项中的属性并没有在视图中使用到，比如存在a，b属性，视图中只用到了a属性，b属性没有使用到，那么在逻辑代码中如果修改了b属性的值，其实是没必要去触发视图更新函数的，所以依赖收集只涉及到视图中使用到了的属性。回到Dep主体对象，分别定义收集订阅者，删除订阅者和发布订阅消息的方法，订阅者就是Watcher，后面会讲到，当数据变动时，在属性劫持的setter中发布消息通知watcher订阅者进行视图更新。

依赖收集的前提条件有两个：触发getter,新建一个watcher对象。在指令解析编译模板阶段会读取对象属性，所有会触发getter，同时在解析指令时给相关的节点作为订阅者绑定更新函数，数据变动就通知更新视图。

第三步：实现指令解析器Compile，用来编译模板，解析指令以及语法糖，然后初始化渲染视图，并将指令相关的节点绑定更新函数，添加监听数据的订阅者，数据一变动收到通知更新视图。出于操作DOM性能的考虑，使用DocumentFragment性能更好，在编译模板过程中，使用DocumentFragment作为容器对子节点进行递归遍历处理，可以将所有的子节点一次性插入到DOM中。

第四步：实现订阅者Watcher，将自身添加到Dep的依赖收集中，定义一个update函数，用于在数据修改之后调用更新视图。

## ES5环境中实现const

Object.defineProperty属性描述符可以用来简单模拟实现const的功能，属性描述符分为存取描述符和数据描述符，数据描述符包括是否可枚举，是否可修改删除的属性。比如简单实现全局下的const a常量，可以这样实现，定义一个函数，接受赋值的参数，然后在window下添加a属性，将是否可枚举是否可修改删除属性都设置为false，读取的时候触发getter的时候返回结果，修改的时候触发setter，判断前后的值是否一致，不一致就抛出错误，提示不能修改值。

## vue3.0使用proxy实现双向绑定

vue3.0中将使用ES6的proxy代替Object.defineProperty实现双向数据绑定，主要是因为Object.defineProperty存在一些缺陷：

1. 对数组的监测存在一定的局限性
2. 只能劫持对象的属性，如果对象的属性是嵌套对象的，只能递归遍历一层层的对属性劫持，如果能劫持一个完整的对象，性能上能有很大的提升

proxy的优势：

1. 可以劫持完整的对象
2. 有13种劫持的方法

## 推荐参考

https://zhuanlan.zhihu.com/p/25464162

[Object.defineProperty-MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)

[createDocumentFragment-MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/createDocumentFragment)

https://www.cnblogs.com/kidney/p/6052935.html

https://github.com/DMQ/mvvm

https://juejin.im/post/5c2042e95188255e9b620964

https://juejin.im/post/5bf3e632e51d452baa5f7375