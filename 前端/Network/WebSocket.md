HTTP 请求方式实现客户端与服务器之间实时通信技术存在的缺陷：

* 无法做到数据的实时性

* 服务端不能主动推送消息给客户端

基于 HTTP 请求方式的实现方案：

* AJAX 轮询: 每隔一段时间就向服务端发起请求，服务端接收到请求后查看是否有数据，有就返回，每一次请求都需要建立起 HTTP 连接，需要经过三次握手，而且在没有新数据的情况下建立的 HTTP 请求是无意义的，这样的操作容易消耗资源。

* Long Poll: 通过发起 HTTP 请求建立起连接之后，连接不会被关闭，会继续保持这样的状态询问服务端是否有数据，直到服务端有数据并做出响应后，把数据返回给客户端，该条 HTTP 连接才会被关闭，并且会再次开启新的一条请求连接。

## WebSocket

* HTML5提供的一种浏览器和服务器之间进行全双工通信协议，2008年产生，2011年成为标准
* 解决了服务端不能主动向客户端发送消息的问题

* 使用

    ```javascript
        const socket = new WebSocket(url, protocols);
    ```
    WebSocket 是个构造函数，接受两个参数，第一个参数是需要连接的响应  WebSocket 的地址，第二个参数是子协议，值可以是字符串或者数组，这样做可以是一个服务器实现多个 WebSocket 子协议，可以通过设置不同的子协议来响应不同类型的通信。
        
    * readyState
        返回实例化对象的当前状态，也就是连接的当前状态，有四种状态，状态都是常量

        * CONNECTING：  值为0，表示连接还没开启
        * OPEN： 值为1，表示已经连接成功，可以通信
        * CLOSING： 值为2，表示正在关闭连接
        * CLOSED： 值为3，表示连接已经关闭或者连接无法建立

    * onopen： 实例对象属性，表示连接成功的事件监听器
    * onmessage： 实例对象属性，表示服务端推送消息的事件监听器
    * onclose： 实例对象属性，表示连接关闭的事件监听器
    * onerror：实例对象属性，表示通信过程中出现错误的事件监听器
    * send()： 实例对象方法，用于客户端向服务端发送数据
    * close()： 实例对象方法，用于客户端关闭或停止连接 

* 参考

    [http://www.ruanyifeng.com/blog/2017/05/websocket.html](http://www.ruanyifeng.com/blog/2017/05/websocket.html)

    [https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket)    
	
	[https://mp.weixin.qq.com/s/rKvoevbSmtAUoCgOH2lZdQ](https://mp.weixin.qq.com/s/rKvoevbSmtAUoCgOH2lZdQ)

    [https://juejin.im/post/5afab6e651882542ba07eb41](https://juejin.im/post/5afab6e651882542ba07eb41)

    [https://juejin.im/post/5a1bdf676fb9a045055dd99d#heading-6](https://juejin.im/post/5a1bdf676fb9a045055dd99d#heading-6)

    [https://qiutc.me/post/websocket-guide.html](https://qiutc.me/post/websocket-guide.html)