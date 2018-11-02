## BFC

* BFC 是 web 页面中盒模型布局的 CSS 渲染模式。
* BFC 相当于创建了一个隔离容器，容器内部元素与外部元素相互不影响。
* 一个元素不能同时存在于两个 BFC 中。

#### 创建 BFC 方式如下，只要满足一个条件即可：

* 根元素（html 元素）
* 浮动（float 值不为 none）
* 绝对定位（position 值不为 static 和 relative）
* overflow 值不为 visible
* display 值为 table-cell, table-caption, inline-block, flex, inline-flex 中的一个

####BFC 的布局规则：

* 内部的盒模型会在垂直方向按照顺序一个接一个的排列
* 同一个 BFC 内部的相邻元素的外边距会重叠
* BFC 相当于页面上的独立隔离容器，里面的子元素和外部元素相互不影响
* 计算 BFC 容器的高度时，浮动元素也参与计算
* 同一个 BFC 内部每个盒子的左外边框紧挨着包含块的左边框（从右到左的格式，则为紧挨右边框），即使存在也是这样

### 参考

* https://juejin.im/post/59b73d5bf265da064618731d
* https://juejin.im/post/5909db2fda2f60005d2093db
* [理解CSS中BFC](https://www.w3cplus.com/css/understanding-block-formatting-contexts-in-css.html)

