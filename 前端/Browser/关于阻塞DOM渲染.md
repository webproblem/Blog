## 前言

前段时间，有个小姐姐问了我一道面试题，题目大致是：```css 和 js 是如何阻塞浏览器渲染 DOM 的，并给出一些优化方案。``` 后来发现自己给出的答案并不正确，所以这里就来总结下。

### CSS 不会阻塞 DOM 解析，但是会阻塞 DOM 渲染

首先需要知道的是，浏览器在渲染整个页面的过程中，遇到 css(外链表或者内联样式)，都会阻塞后面的 DOM 渲染，但是对于后面的 DOM 解析会正常进行。这里写个 Demo 测试下。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>css阻塞</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      h1 {
        color: red !important
      }
    </style>
    <script>
      var time1 = 0;  
      function h () {
        console.log(document.querySelectorAll('h1'));
        time1 = Date.now();
      }
      setTimeout(h, 0)
    </script>
    <link href="https://cdn.bootcss.com/bootstrap/4.0.0-alpha.6/css/bootstrap.css" rel="stylesheet">
  </head>
  <body>
    <h1>这是红色的</h1>
    <script>
        console.log('被阻塞了的js，耗时：' + (Date.now() - time1));
    </script>
  </body>
</html>
```

模拟浏览器教慢网络的情况下测试，测试的结果是：浏览器会先打印出获取 h1 的节点（没有阻塞 DOM 解析），而后再等样式文件下载解析完成后再渲染出 h1 节点元素（阻塞了 DOM 渲染）。

![image](https://user-images.githubusercontent.com/20440496/49925989-7d740c00-fef5-11e8-827b-2f7603f327dc.png)

同时也可以看到，css 文件的下载也延迟了后面 js 脚本的执行，脚本在等待 css 文件下载完成后才执行的。这里就有两个问题需要明白：

1. 为什么 css 只阻塞 DOM 渲染，而不阻塞 DOM 解析？
2. 后面的 js 脚本为什么要等待前面的 css 文件下载？

关于第一个问题，首先要明白浏览器的渲染流程，不同内核的浏览器渲染过程可能会有些不一样，以 webkit 为例。

![image](https://user-images.githubusercontent.com/20440496/49929503-997bab80-fefd-11e8-8f40-3d73f58bffb8.png)

* 解析 HTML 文件，生成 DOM Tree
* 解析 CSS 文件，生成 CSSOM Tree
* 合并 DOM Tree 和 CSSOM Tree 生成渲染树
* 根据 Render Tree 机制绘制页面

可以看到，DOM 解析和 CSS 解析是独立开来不相互影响的，所以 CSS 并不会阻塞 DOM 的解析。然而 Render Tree 是依赖于 DOM Tree 和 CSSOM Tree 的，页面渲染必须等待 CSSOM Tree 构建完成之后才会继续进行，所以 CSS 会阻塞 DOM 的渲染。

关于第二个问题，其实是因为浏览器内核（浏览器渲染进程）是多线程工作的，浏览器内核包含了两个线程：GUI 渲染线程，JS 引擎线程。GUI 渲染线程负责渲染页面，解析 HTML，CSS 构成 Render Tree，布局和绘制等，JS 引擎线程负责解析 Javascript 脚本，执行代码 。这两个线程之间是互斥的，也就是不能并行执行，当遇到 CSS 文件需要下载解析时，JS 引擎线程必须等待 GUI 渲染线程执行完前面的任务后才会执行，所以后面的 js 脚本必须等待前面的 css 文件下载解析完成后再执行。

### JS 会阻塞 DOM 解析，也会阻塞 DOM 渲染

浏览器在下载解析及执行 JS 脚本（外链和内联）的时候，都会阻塞 DOM 的解析和渲染。这也是因为 GUI 渲染线程 和 JS 引擎线程是互斥的。JS 引擎在执行过程中，GUI 线程会被挂起，GUI更新会被保存在一个队列中等到JS引擎空闲时立即被执行。

其实也可以这样理解：浏览器在没下载解析 JS 脚本之前并不知道要进行怎样的操作，如果不阻塞后面 DOM 的解析和渲染，等到后面 DOM 解析渲染完成后，JS 脚本下载完成再执行发现里面有删除 DOM 的操作，那么前面的 DOM 解析渲染流程就变得无意义且会引发回流重绘导致性能下降。所以浏览器需要停止解析渲染，下载并执行 JS 脚本后再继续解析渲染后面的内容。

### 小结

* css 文件在下载解析时会阻塞后面 DOM 的渲染，但不会阻塞 DOM 的解析，且会延迟后面 JS 脚本的执行
* js 文件在下载执行时不但会阻塞 DOM 的渲染还会阻塞 DOM 的解析，如果 JS 执行时间过长，会导致页面的渲染不连贯，甚至出现页面空白加载

### 优化方案

* css 文件放置在 head 标签中，如果涉及到页面加载的样式，就内联样式
* js 文件放置在 body 尾部，减少 js 解析执行对页面渲染造成的阻塞
* 合并压缩 css/js 文件，减少 http 请求数和请求体积
* 使用浏览器缓存，图片资源优化等

### 推荐阅读

* [css加载会造成阻塞吗](https://github.com/chenjigeng/blog/blob/master/css%E5%8A%A0%E8%BD%BD%E4%BC%9A%E9%80%A0%E6%88%90%E9%98%BB%E5%A1%9E%E5%90%97%EF%BC%9F.md)
* [CSS/JS 阻塞 DOM 解析和渲染](https://harttle.land/2016/11/26/static-dom-render-blocking.html)
* [原来 CSS 与 JS 是这样阻塞 DOM 解析和渲染的](https://juejin.im/post/59c60691518825396f4f71a1)
* [关键渲染路径](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/?hl=zh-cn)
* [CSS 与网络性能](https://mp.weixin.qq.com/s/0fSUaT-Y1b5hmXJ3Q0bmJA)
* [从浏览器多进程到JS单线程，JS运行机制最全面的一次梳理](https://segmentfault.com/a/1190000012925872)