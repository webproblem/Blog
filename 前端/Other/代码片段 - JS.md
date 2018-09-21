## 常用的代码片段，持续更新

### js 复制功能

兼容IE8及以上。

js 只能复制选中的内容，而不能实现让内容自动选中。所以使用隐藏 textarea 标签作为转接点，将要复制的内容设置在 textarea 的 value 值上，然后再选中 textarea 中的内容，执行复制命令。

```html
<textarea type="text" id="v-copy-link-id" class="v-copy-link"></textarea>
```

```javascript
function copyFn() {
    document.getElementById('v-copy-link-id').select(); // 选择对象
    document.execCommand("Copy"); // 执行浏览器复制命令
}
```

### 获取URL链接上的参数

```javascript
/**
 * @param {String} name 参数名
 * @param {String} url  URL链接
 */
function getURLParam(name, url) {
	var m = decodeURIComponent(url || window.location.href).match(new RegExp("[?&]" + name + "=([^=&]*)(&|$)"));
	return m ? m[1]: null;
}
```

### 隐匿手机号

```javascript
function hidePhone(phone) {
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}
```

### 判断参数是否是其中之一

```javascript
/**
 * @param {any} value 需要验证的参数值 
 * @param {Array}  list  数据列表
 */
function insideOf(value, list) {
    for(var i=0; i<list.length; i++) {
        if(value === list[i]) return true;
    }
    return false;
}
```

## 获取 DOM 元素上的 CSS 样式

```javascript
/**
 * 
 * 将横线分隔式的字符转换成驼峰式字符
 * @param {any} data 
 * @returns 
 */
function camelCase(data) {
	if(!data) return null;
	var REGEXP_KEBAB_CASE = /[\:\-]+(.)/g;
	return data.replace(REGEXP_KEBAB_CASE, function(match, $1, offset){
		return offset ? $1.toUpperCase() : $1;
	})
}
/**
 * @param {any}     element   DOM元素 
 * @param {String}  cssParam  样式名称    
 */
function getOneStyle(element, cssParam) {
    if(!element || !cssParam) return null;	
    element = typeof element == 'string' ? document.querySelector(element) : element;
    cssParam = camelCase(cssParam);
    if(cssParam == 'flot') {
        cssParam = 'cssFloat';
    }
    var allStyle = document.defaultView.getComputedStyle(element, null);
    return element.style[cssParam] || allStyle ? allStyle[cssParam] : null;
}
```



