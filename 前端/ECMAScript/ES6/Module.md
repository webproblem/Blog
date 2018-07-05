## Module

* ES6 中的模块是编译时加载的。
* 模块功能主要是由两个命令构成的，export 和 import。export 指的是模块对外的输出接口，import 是其他脚本输入模块的功能。

## export 

export 命令的用法如下
```javascript
export const name = '白展堂';

export function change(m,n) {
    return m + n;
}

const age = 25;
const sex = '男';
const work = '跑堂';
export {age, sex, work};
```

* export 命令的输出可以是变量，函数，对象，class类等。
* 多个输出对象一起输出，需要使用 {} 大括号。
* 通常情况下，输出的对象名称就是对象本身的名称，但是也可以在输出的时候重命名

    ```javascript
    // a.js
    function httpAxios() {
        // do something...
    }
    // 重命名 httpAxios 函数的对外接口名称
    export {httpAxios as axios};

    // b.js
    import {axios} from 'a.js';
    ```
* export 命令规定的是对外的接口，必须与模块内部的变量建立一一对应关系。
    ```javascript
    // 错误写法一
    export 1;
    // 错误写法二
    const vm = 1;
    export 1;
    ```    

## export default

* 用于模块的默认输出。
* 一个模块中只允许使用一次 export default 命令。
* import 命令可以任意指定默认输出的变量名称，并且 import 命令不需要使用 {} 大括号。
* 本质上其实就是对外输出 default 变量，将要输出的对象名称赋值给 default 变量。

    ```javascript
    // 直接默认输出一个值
    export default 1;
    // 默认输出一个函数
    export default function() {};
    ```

## import

其他 JS 文件中想要引入模块中输出的接口时，就使用 import 命令。
```javascript
// a.js
function httpAxios() {
    // do something...
}
export {httpAxios};

// b.js
import {httpAxios} from 'a.js';
```    

* import 命令输入的变量必须和 export 命令输出的变量保持一致，如果不一致的情况，必须修改一方的变量来保持一致。

* 使用 as 关键字给输入的变量重命名
    ```javascript
    import {httpAxios as axios} from 'a.js';
    ```
使用形式    
```javascript
// 写法一
import {a, b, c} from 'app.js';

// 写法二
// 当需要使用到模块中对外输出的接口太多，一个一个写出来会很显得很长
import {a,b,c,d,e,f,g} from 'app.js';
// 正确的做法应该是加载整个模块
import * as obj from 'app.js';
obj.a;
obj.b;
obj.c;

//写法三
// 加载模块默认输出的变量
// a.js
import name from 'app.js';

//写法四
// 加载模块并执行，但是不输入任何值
import 'app.js';
```    