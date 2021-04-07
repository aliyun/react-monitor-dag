<h3 align="center">
  一个基于React的运维/监控DAG图
</h3>

[English](./README.en-US.md) | 简体中文


<p align="center">
  <img width="100%" src="https://img.alicdn.com/imgextra/i2/O1CN01nRgm2r1I0BOXGYq9a_!!6000000000830-1-tps-1665-826.gif">
</p>

## ✨ 特性
* 支持左到右，上到下的布局
* 支持自定义状态，左上角自定义状态注释
* 支持自定义节点样式，以及hover，focus状态
* 支持线段label样式
* 支持节点，锚点，线段label的tooltips
* 支持节点，线段的右键菜单
* 支持minimap，以及高亮状态
* 支持线段流动动画

## 📦 安装
```
npm install react-monitor-dag
```
```js
import MonitorDag from 'react-monitor-dag';
import 'react-monitor-dag/dist/index.css';
<MonitorDag
  data={data}
  nodeMenu={menu}                   // 节点菜单
  edgeMenu={menu}                   // 线段菜单
  onClickNode={(node) => {}}        // 单击节点事件
  onContextmenuNode={(node) => {}}  // 右键节点事件
  onDblClickNode={(node) => {}}     // 双击节点事件
  onClickEdge={(edge) => {}}        // 单击线段事件
  onContextmenuEdge={(edge) => {}}  // 右键线段事件
  polling={{                        // 支持轮训
    enable: true,
    interval: 5000,                 // 轮训间隔
    getData: (data) => {            // 获取数据方法

    }
  }}
  registerStatus={{                 // 自行注册状态，会根据node的status给节点加上class
    success: 'success-class',
    fail: 'fail-class',
    timeout: 'timeout-class',
    running: 'runnning-class',
    waitting: 'waiting-class',
    other: 'other-class'
  }}
  statusNote={{                      // 左上角的状态注释
    enable: true,
    notes: [{
      code: 'success',
      className: 'success-class',
      text: '运行成功'
    }]
  }}
>
</MonitorDag>
```

```js
interface menu { // '节点/线段'的右键菜单配置
  title?: string, // 每列的展示的名字
  key: string, // 每列的唯一标志，对应数据上的key值
  render?(key: string): void, // 支持每列的自定义样式
  onClick?(key: string, data: any): void, // 每列的点击回调
}

interface config {
  direction: string,  // 图的方向: 'left-right' or 'top-bottom'
  edge: {         // 定制线段的类型
    type: string,
    config: any
  },
  labelRender?(label: JSX.Element): void,  // 线段label的渲染方法
  labelTipsRender?(data: any): void,    // 线段label tips的渲染方法
  nodeRender?(data: any): void,    // 节点的渲染方法
  nodeTipsRender?(data: any): void,    // 节点tips的渲染方法
  endpointTipsRender?(data: any): void,    // 锚点tips的渲染方法
  minimap: {   // 是否开启缩略图
    enable: boolean,
    config: {
      nodeColor: any, // 节点颜色
      activeNodeColor: any // 节点激活颜色
    }
  }
}

interface props {
  data: any,                           // 画布数据
  width?: number | string,             // 组件宽
  height?: number | string,            // 组件高
  className?: string,                  // 组件classname
  nodeMenu: Array<menu>,               // 节点右键菜单配置
  edgeMenu: Array<menu>,               // 线段右键菜单配置
  groupMenu: Array<menu>,              // group右键配置
  config?: any,                        // 画布配置
  polling?: {                          // 支持轮训
    enable: boolean,
    interval: number,                  // 轮训时间
    getData(data): void                // 轮训方法
  },
  registerStatus?: {                   // 自行注册状态，会根据node的status给节点加上class
    success: string,
    fail: string,
    // key:value的形式，可以自行注册，和node的status字段对应起来
  },
  statusNote?: {                       // 画布左上角状态注释
    enable: boolean,
    notes: [{
      code: string,
      className: string,
      text: string
    }]
  },
  onClickNode?(node: any): void,                 // 单击节点事件
  onContextmenuNode?(node: any): void,           // 右键节点事件
  onDblClickNode?(node: any): void,              // 双击节点事件
  onClickEdge?(edge: any): void,                 // 单击线段事件
  onClickLabel?(label: string, edge: any): void, //单击label的事件
  onContextmenuEdge?(edge: any): void,           // 右键线段事件
  onContextmenuGroup?(edge: any): void,           // 右键节点组事件
  onChangePage?(data:any): void,                  // 点击分页事件
}
```

如需要更多定制的需求，您可以提issue或者参考[Butterfly](https://github.com/alibaba/butterfly)来定制您需要的需求