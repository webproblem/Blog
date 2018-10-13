var app = new Vue({
    el: '#map-main',
    data() {
        return {
            // map 对象
            mapObj: null,
            // 存储 MouseTool 插件返回值
            mouseTool: null,
            // 存储 PolyEditor 插件返回值
            polygonEditor: null,
            // 围栏的初始化值
            polygon: null,
            // 围栏填充颜色
            fillColor: '#42a3f8',
            // 存储围栏各点的经纬度
            polyArr: []
        }
    },
    mounted() {
        const vm = this;
        vm.initMap();
        
        // 围栏展示效果的代码
        // var data = [
        //     {
        //         color: "#ED3815",
        //         polygonArr: [
        //             [116.388692, 39.877514],
        //             [116.389443, 39.877514],
        //             [116.389443, 39.877123],
        //             [116.388692, 39.877123]
        //         ]
        //     },
        //     {
        //         color: "#F1691B",
        //         polygonArr: [
        //             [116.389427, 39.878124],
        //             [116.39007, 39.878124],
        //             [116.39007, 39.877802],
        //             [116.389427, 39.877802]
        //         ]
        //     },
        //     {
        //         color: "#15ED35",
        //         polygonArr: [
        //             [116.388595, 39.879136],
        //             [116.390017, 39.879136],
        //             [116.390226, 39.879023],
        //             [116.390274, 39.87888],
        //             [116.390226, 39.878811],
        //             [116.389907, 39.878918],
        //             [116.389427, 39.878902],
        //             [116.388595, 39.87891]
        //         ]
        //     },
        //     {
        //         color: "#ED15D3",
        //         polygonArr: [
        //             [116.389421, 39.878465],
        //             [116.390033, 39.878465],
        //             [116.390033, 39.878156],
        //             [116.389421, 39.878156]
        //         ]
        //     },
        //     {
        //         color: "#9970D3",
        //         polygonArr: [
        //             [116.389475, 39.877428],
        //             [116.390087, 39.877428],
        //             [116.390087, 39.877008],
        //             [116.389475, 39.877008]
        //         ]
        //     },
        //     {
        //         color: "#42a3f8",
        //         polygonArr: [
        //             [116.389505, 39.876689],
        //             [116.390143, 39.876689],
        //             [116.390143, 39.876385],
        //             [116.389505, 39.876385]
        //         ]
        //     }
        // ]
        // data.forEach((item) => {
        //     new AMap.Polygon(Object.assign({
        //         map: vm.mapObj,
        //         path: item.polygonArr,
        //         strokeColor: item.color,
        //         fillColor: item.color
        //     }, vm.polygon))
        // })
    },
    methods: {
        initMap() {
            const vm = this;
            vm.mapObj = new AMap.Map('container', {
                resizeEnable: true,
                center: [116.40, 39.91],
                zoom: 13
            });
            vm.polygon = {
                strokeOpacity: 1,
                strokeWeight: 3,
                fillOpacity: 0.35
            };
            // 初始化 MouseTool 插件
            vm.mouseTool = new AMap.MouseTool(vm.mapObj);
        },
        // 绘制
        startDrawPolygon() {
            const vm = this;
            vm.mouseTool.on('draw', function(data) {
                if(vm.mapObj.getAllOverlays('polygon').length > 0) {
                    vm.mouseTool.close();
                }
                vm.getPath(data.obj.getPath());
            })
            // MouseTool 插件绘制矩形
            vm.mouseTool.rectangle({
                strokeColor: vm.fillColor,
                fillColor: vm.fillColor
            });
        },
        // 编辑
        startEditPolygon() {
            const vm = this;
            // 初始化 PolyEditor 插件
            vm.polygonEditor = new AMap.PolyEditor(vm.mapObj, vm.mapObj.getAllOverlays('polygon')[0]);
            vm.polygonEditor.open();
            vm.polygonEditor.on('end', function(data) {
                vm.getPath(data.target.getPath());
            })
        },
        // 结束编辑
        closeEditPolygon() {
            this.polygonEditor.close();
            this.polygonEditor = null;
        },
        // 清除围栏
        removePolygon() {
            const vm = this;
            let polyArr = vm.mapObj.getAllOverlays('polygon');
            vm.polygonEditor && vm.polygonEditor.close();
            if(polyArr.length > 0) {
                vm.mapObj.remove(polyArr);
            }
        },
        // 修改填充颜色
        setFillColor() {
            const vm = this;
            new AMap.Polygon(Object.assign({
                map: vm.mapObj,
                path: vm.polyArr,
                strokeColor: vm.fillColor,
                fillColor: vm.fillColor
            }, vm.polygon));
        },
        // 获取经纬度
        getPath(data) {
            const vm = this;
            data && data.forEach(function(item, index) {
                vm.polyArr[index] = [item.lng, item.lat];
            })
            console.log('打开控制台查看数据');
            console.log ({
                color: vm.fillColor,
                polygonArr: vm.polyArr
            })
        }
    }
})