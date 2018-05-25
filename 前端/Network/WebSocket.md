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

https://juejin.im/post/5afab6e651882542ba07eb41

https://juejin.im/post/5a1bdf676fb9a045055dd99d#heading-6

https://qiutc.me/post/websocket-guide.html