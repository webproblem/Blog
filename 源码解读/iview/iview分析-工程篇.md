## 简介

iview 一套基于 Vue.js 的高质量 UI 组件库，主要用于 PC 端中后台产品的开发。

相较于市面上另一个成熟完善的组件库 Element，两者的使用差别不是特别大，只是设计风格不同。有趣的是，Element 和 iview 两者之间的一个差别类似于 React 和 Vue 之间的一个差别，
前者都是由专业的团队打造的产品，后者都是由一个或者少数几个开发者为主导开发的产品。 

### 为什么选择 iview

因为在平时的项目中，用的都是 iview 组件库，而且自己也在尝试写一套类 iview 的简单组件库，附上自己写的组件库地址： [https://github.com/simpleTeam3/simple](https://github.com/simpleTeam3/simple)。

## 项目结构

```
|—— assets                                      //静态资源
|—— build                                       //编译文件
    |—— build-style.js                          //打包样式，字体文件
    |—— locale.js                               //多语言国际化文件
    |—— webpack.base.config.js.js               //基本配置文件
    |—— webpack.dev.config.js                   //开发环境配置文件
    |—— webpack.dist.dev.config.js              //iview.js打包配置文件
    |—— webpack.dist.locale.config.js           //iview多语言打包配置文件
    |—— webpack.dist.prod.config.js             //iview.min.js打包配置文件
    |—— webpack.test.config.js                  //单元测试配置文件
|—— examples                                    //组件Demo
|—— src                                         //项目入口
    |—— components                              //所有的组件
    |—— directive                               //自定义指令
    |—— locale                                  //多语言文件
    |—— mixins                                  //mixins混合文件
    |—— styles                                  //样式文件
    |—— utils                                   //工具函数文件
    |—— index.js                                //定义全局组件入口
|—— test                                        //单元测试
|—— package.json     
```

### package.json文件

阅读iview的整个架构或者其他前端项目架构，应该是从package.json文件开始。package.json中可以看到一些关于iview的描述信息，以及整个项目的依赖项，