## Promise

* 含义

    Promies 对象是异步编程的解决方案之一，比传统的异步解决方案——回调函数更合理更强大。  

    想象下这样的一个场景，在管理系统的新闻模块下，编辑新闻的时候，在获取到编辑详情之前，可能需要先获取到新闻的分类列表，新闻图片的类型列表，新闻发布者的列表之后，这样才能把对应的详情内容填充上去，因为这些选项都是 select 下拉菜单。那么这些内容都是通 AJAX 去异步请求的，为了保证所有的内容填充上去之前获取到所有的列表，回调函数的解决方案应该是这样的：

    ```javascript
    //新闻的分类列表
    function getNewsType() {
        $.ajax({
            ...
            success: function(res) {
                ...
            },
            complete: function() {
                getImgType();
            }
        })
    }
    //获取新闻图片的类型列表
    function getImgType() {
        $.ajax({
            ...
            success: function(res) {
                ...
            },
            complete: function() {
                getAuthor();
            }
        })
    }
    //获取新闻发布者的列表
    function getAuthor() {
        $.ajax({
            ...
            success: function(res) {
                ...
            },
            complete: function() {
                getNewsDetail();
            }
        })
    }
    //获取编辑新闻详情
    function getNewsDetail() {
        $.ajax({
            ...
            success: function(res) {
                ...
            }
        })
    }

    ```

    可以看到，这种解决方案是一层嵌套一层的，当嵌套的层数多了，代码就会变得难以维护了。Promise 的出现就是为了解决异步回调函数的回调地狱问题。

    Promise 其实就相当于一个容器，里面存放着在未来才会结束的异步操作结果。Promise 有三种状态：pending(进行中)，fulfilled(已成功) 和 rejected(已失败)。只有异步操作的结果才能改变当前的状态，并且当状态一旦发现改变后就固定了状态，后面的操作将不会引发状态的改变。

    * 基本使用

    Promise 对象是一个构造函数，使用起来很简单，用 new 关键字去实例化就行了。
    ```javascript
    const promise = new Promise(function(resolve, reject) {
        if(...) {
            //异步操作成功
            resolve();
        }else {
            //异步操作失败
            reject();
        }
    });
    ```

    Promise 构造函数接收一个函数作为参数，这个函数中存在两个参数 resolve 和 reject。这两个参数都是函数，它们的作用分别是，resolve 表示异步操作成功后将 Promise 状态从 pending 改变为 fulfilled，如果带有参数的话会将参数传递出去；reject 表示异步操作失败后将 Promise 状态从 pending 改变为 rejected，如果带有参数的话会将参数传递出去。

* Promise.prototype.then

    Promise 状态发生改变后可以捕捉到状态的改变并且使用 then 方法指定状态改变后的回调函数。

    ```javascript
    const promise = new Promise(function(resolve, reject) {
        if(...) {
            //异步操作成功
            resolve();
        }else {
            //异步操作失败
            reject();
        }
    });

    promise.then(function() {
        //状态变为 fulfilled 的回调函数
    }, function() {
        //状态变为 rejected 的回调函数
    })
    ```
    then 方法接收两个函数作为参数，第一个参数是状态变为 fulfilled 的回调函数，第二个参数是状态变为 rejected 的回调函数，两个函数分别接收异步操作结果传递出来的参数作为函数的参数。

* Promise.prototype.catch

    状态变为 rejected 的回调函数其实可以使用 catch 方法代替的，并且也推荐使用这种方式，就是这样：

    ```javascript
    function test(state) {
        return new Promise(function(resolve, reject) {
            if(state) {
                resolve('success');
            }else {
                resolve('fail');
            }
        })
    }

    //写法一
    test(false).then(function(state) {
        console.log('状态：' + state);
    }, function(state) {
        console.log('状态：' + state);
    })
    //写法二
    test(false).then(function(state) {
        console.log('状态：' + state);
    }).catch(function(state) {
        console.log('状态：' + state);
    })
    ```

    catch 方法可以捕获到 Promise 异步操作失败或者内部抛出错误，甚至可以捕获到前面的 then 方法的回调函数抛出的错误，这也是用 catch 代替状态变为 rejected 的回调函数的原因，catch 方法的定位就是用来捕获错误信息的。

* Promise.prototype.finally

    finally 方法表示的是不管 Promise 状态变成哪种状态，finally 方法总是会执行的，类似于 $.ajax 中的 complete 方法。

* Promise.all

    Promise.all 接收多个 Promise 实例的数组作为参数，将这些实例包装成一个新的 Promise 实例。新的 Promise 实例的状态由数组中的 Promise 实例决定。使用 all 方法可以并行执行多个异步操作。    
    回到前面假设的那个场景，使用 Promise.all 方法处理应该是这样的：
    ```javascript
    //新闻的分类列表
    function getNewsType() {
        return new Promise(function(resolve, reject) {
            $.ajax({
                ...
                success: function(res) {
                    resolve();
                }
            })
        })
    }
    //获取新闻图片的类型列表
    function getImgType() {
        return new Promise(function(resolve, reject) {
            $.ajax({
                ...
                success: function(res) {
                    resolve();
                }
            })
        })
    }
    //获取新闻发布者的列表
    function getAuthor() {
        return new Promise(function(resolve, reject) {
            $.ajax({
                ...
                success: function(res) {
                    resolve();
                }
            })
        })
    }
    //获取编辑新闻详情
    function getNewsDetail() {
        $.ajax({
            ...
            success: function(res) {
                ...
            }
        })
    }

    Promise.all([getNewsType(), getImgType(), getAuthor()]).then(function() {
        //只有当所有的 Promise 对象的状态都变为 fulfilled，Promise.all 生成的 Promise 实例的状态是 fulfilled
        getNewsDetail();
    }).catch(function() {
        //当只要有一个Promise 对象的状态都变为 rejected，Promise.all 生成的 Promise 实例的状态是 rejected
    })
    ```

* Promise.race

    Promise.race 和 Promise.all 的区别就是，只要参数数组中的 Promise 实例的状态有一个率先改变，那么 Promise.race 生成的 Promise 实例的状态就是率先改变的 Promise 实例状态。

* Promise.resolve

    将接收的参数转为 Promise 对象。

* Promise.reject

    Promise.reject 首先会生存一个 Promise 实例对象，再将 Promise 实例状态转为 rejected。
