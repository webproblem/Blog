最近的项目工作中，都是在做一些数据可视化的工作，用的是echarts可视化工具，项目技术栈是vue，这里就记录一下在vue中使用echart的实践。

简单说下echarts的使用。
echarts使用起来其实就几个步骤：

1. 创建容器
2. 初始化echarts
3. 设置配置项

```html
<!-- 创建容器 -->
<div id="myChart"></div>

<script>
var myChartOption = {
    //具体配置项
    //...
}
//初始化echarts
var myChart = echarts.init(document.getElementById('myChart'));
//设置配置项
myChart.setOption(myChartOption);
</script> 
```

那么在vue中，一个页面需要绘制多个echarts的时候，可以按照下面的套路的编写代码，至少代码看上去比较的优雅。

1. 首先配置项单独提取出来放置在一个js中，如：option.js
```javascript
export const lineChartOption = {
    //...
}

export const barChartOption = {
    //...
}

export const pieChartOption = {
    //...
}
```
然后在业务代码文件中把配置文件导入进来使用，如：main.js
```javascript
import {lineChartOption, barChartOption, pieChartOption} from 'option.js'

new Vue({
    el: '#app',
    data() {
        return {
            //折线图表实例
            lineChart: null,
            //折线图表配置项
            lineChartOption,
            //柱状图表实例
            barChart: null,
            //柱状图表配置项
            barChartOption,
            //饼状图表实例
            pieChart: null,
            //饼状图表配置项
            pieChartOption
        }
    },
    mounted() {
        this.initData();
    },
    methods: {
        initData() {
            //...
            this.initAllChart();
        },
        //初始化所有图表
        initAllChart() {
            this.drawLineChart();
            this.drawBarChart();
            this.drawPieChart();
        },
        //绘制折线图表
        drawLineChart() {
            vm.lineChart = echarts.init(document.getElementById('line-chart'));
            vm.lineChart.setOption(vm.lineChartOption);
        },
        //绘制柱状图表
        drawBarChart() {
            vm.barChart = echarts.init(document.getElementById('bar-chart'));
            vm.barChart.setOption(vm.barChartOption);
        },
        //绘制饼状图表
        drawPieChart() {
            vm.pieChart = echarts.init(document.getElementById('pie-chart'));
            vm.pieChart.setOption(vm.pieChartOption);
        },
        //在浏览器窗口缩放的时候，图表的尺寸大小也跟着缩放
        resizeChart() {
            const allChart = [
                vm.lineChart,
                vm.barChart,
                vm.pieChart
            ];
            allChart.forEach(function(item) {
                item.resize && item.resize();
            })
        }
    }
})
```

```html
<div class="data-chart-con" v-resize="resizeChart">
    <div id="line-chart"></div>
    <div id="bar-chart"></div>
    <div id="pie-chart"></div> 
</div>
```

所有的图表会跟着浏览器窗口缩放而缩放，可以写成一个Vue全局的自定义指令， resize.js:
```javascript
```