## $.ajax, axios, fetch

前端 http 请求方式的发展历程： ```原生 XHR -> 对 XHR 封装的 $.ajax -> 对 XHR 封装的 axios -> 与原生 XHR 对等的同为原生的 fetch```。

## $.ajax

* 不支持链式调用，存在回调嵌套，不符合现代 ES 规范。

* 基于原生的 XHR 封装的请求方式，XHR 本身存在缺陷。

* 使用 $.ajax 时需要引入整个 jQuery 库。

## axios

* 本质上基于原生的 XHR 封装的请求方式，但是是 Promise 实现版本，支持链式调用，符合现代 ES 规范。

* axios 拦截器，可以在发送请求和响应之前进行拦截。

* 客户端支持防御 XSRF。

## Fly

* Fly 是基于 Promise 实现的 http 请求方式，它的强大在于能够兼容性好，能够在多平台下使用统一的请求方式。

* 与 axios 的区别： [fly.js vs axios](https://juejin.im/post/59eee969f265da430e4e5853)

## fetch

* XHR 的替代品，原生 API 丰富简洁，更加语义化，基于标准 Promise 实现，支持 async/await。

* fetch 本身存在一些缺陷，所以 fetch 并不适合直接使用，要进一步的封装。
	
	* 默认不携带 cookie，需要手动配置。

	* 只有当网络请求错误的时候， Promise 状态才会变为 rejected。	

## 参考

* [https://segmentfault.com/a/1190000012836882](https://segmentfault.com/a/1190000012836882)

* [fetch 兼容 IE9](https://juejin.im/post/5a7d790b6fb9a0633e51cae0)