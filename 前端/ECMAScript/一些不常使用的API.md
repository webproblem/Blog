## 记录一些不常使用的 API 或知识点

### console

总结下 console 一些常用的 API。

#### console.log

平时用得最多的 API，经常用于向控制台打印一些信息或数据。console.log 方法可以接受多个类型不同的参数，按照参数顺序依次输出，且支持占位符。

```javascript
var arr = [
    {
        name: '白展堂',
        work: '跑堂'
    },
    {
    	name: '吕秀才',
    	work: '账房'
    },
    {
    	name: '李大嘴',
    	work: '厨师'
    }
];
console.log(arr);

console.log('%d年%d月%d日', 2018,6,5);

console.log('%c我是蓝色的输出文字', 'color:blue');
```

![](./assets/console_api_1.png)

实现百度页面控制台的输出信息，效果如下：

![](./assets/console_api_5.png)

```javascript
console.log(`自己的实现\n同学，祝贺你喜提彩蛋~\n或许你们还在犹豫是否加入，我会坦诚的告诉你我们超酷；\n在这里大家都用无人车代步，AI音箱不仅播放还可以交互；\n人工智能是发展的核心技术，做自己让未来不只领先几步；\n在这里做自己，欢迎来到百度！`);
console.log(`%c百度2019校园招聘简历提交：http://dwz.cn/XpoFdepe （你将有机会直接获得面试资格）`, "color:red")
```
#### 分类信息输出

console.log 是作为普通信息输出的方法，其他类型信息输入放入如下，与 console.log 的使用类似

* console.info, 提示信息的输出
* console.warn, 警告信息的输出
* console.error, 错误信息的输出
* console.debug, 使用日志级别向控制台输出消息`"debug"` 

```javascript
console.log('文字信息');
console.info('提示信息');
console.warn('警告信息');
console.error('错误信息');
```

![](./assets/console_api_2.png)

#### console.table

将数据以表格的形式输出。

```javascript
var arr = [
    {
        name: '白展堂',
        work: '跑堂'
    },
    {
    	name: '吕秀才',
    	work: '账房'
    },
    {
    	name: '李大嘴',
    	work: '厨师'
    }
];

console.table(arr);
```

![](./assets/console_api_3.png)

#### console.time

启动一个计时器来跟踪某个操作的耗时时长，与 console.timeEnd 一起使用。

```javascript
console.time('timer');
function shuffle(arr) {
    return arr.concat().sort(function() {
        return Math.random() - 0.5;
    })
}
var count = new Array(7).fill(0);

for(var i=0; i<10000; i++) {
    var arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
    arr = shuffle(arr);
    count[arr.indexOf('a')]++;
}
console.timeEnd('timer');
```

![](./assets/console_api_4.png)

#### 参考

https://segmentfault.com/a/1190000002511877