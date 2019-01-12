## Vue 生命周期

Vue 的生命周期主要是这些钩子函数：beforeCreated, created, beforeMount, mounted, beforeUpdata, updated, beforeDestory, destoryed。实例创建前后，挂载前后，更新前后，销毁前后。

### 生命周期详解

在实例创建阶段，主要是进行事件初始化，数据监测等，new vue 的时候，内部会触发 init 函数进行初始化。

在beforeCreate阶段也就是实例初始化但是还没创建完成的时候，数据监测和事件初始化还没完成，不能对任何数据访问操作。

created阶段，实例创建完成，数据监测和事件初始化也都完成，可以访问和操作data数据，但是在这一步，$el还获取不到，这一步可以开始一些数据请求的操作。

实例创建完成后，就进入到挂载阶段，在挂载阶段就可以访问 $el 的值了。要说明的是进入挂载阶段前，会先判断传入的配置项中是否有 el 属性，如果有才会继续初始化，如果没有初始化会暂停，等到执行了 vm.$mount(el) 后才会继续。在 beforeMount 阶段，内部会找到 template 配置项作为模板进行编译成 render 函数,如果没有template 配置项，则使用外部 HTML 作为模板，如果有直接配置 render 函数，则直接使用配置的 render 函数，优先级是：render 函数选项-template选项-外部HTML。并且在 beforeMount 阶段，$el 获取的值还是双大括号的 vue 语法，只是个占位符，内容还没有被替换掉。

当执行完 render function之后，到了mounted阶段，el被创建的vm.$el替换掉，挂载完成。

到这里为止，初始化过程中会触发上面这些钩子函数，更新和销毁钩子函数都需要手动触发的。

当修改 data 选项中的数据时，会触发 beforeUpdate 和 updated，虚拟 DOM 按照 DIFF 算法重新渲染和打补丁，最后 DOM 更新完成后进入到 updated 阶段。

beforeDestory 是在vue实例销毁之前调用，在这里，实例仍然可以访问操作，一般在这一步中进行：销毁定时器、解绑全局事件、销毁插件对象等操作。

destoryed 在实例销毁后调用，所有指令都将会解绑，事件监听移除，子实例也会销毁。

![image](https://user-images.githubusercontent.com/20440496/51070161-87fdfe80-1677-11e9-8d1d-67f1b86bad0a.png)

### 推荐阅读

[Vue2.0生命周期（组件钩子函数与路由守卫）](https://segmentfault.com/a/1190000013956945)

[详解vue生命周期](https://segmentfault.com/a/1190000011381906)

[如何解释vue的生命周期才能令面试官满意？](https://juejin.im/post/5ad10800f265da23826e681e)

[vue 生命周期深入](https://juejin.im/entry/5aee8fbb518825671952308c)

[vue文档-生命周期](https://cn.vuejs.org/v2/api/#%E9%80%89%E9%A1%B9-%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E9%92%A9%E5%AD%90)

[Vue 实例中的生命周期钩子详解](https://github.com/koucxz/blog/issues/3)

