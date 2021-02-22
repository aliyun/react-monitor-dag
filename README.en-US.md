<h3 align="center">
  A React-based Operations/Monitoring DAG Diagram
</h3>

English| [简体中文](./README.md)


<p align="center">
  <img width="100%" src="https://img.alicdn.com/imgextra/i4/O1CN01tbmIry23xWea1YcBQ_!!6000000007322-1-tps-1665-829.gif">
</p>

## ✨ Feature
* support the direction of left-to-right, top-to-bottom
* support for custom status, custom status note in upper left corner
* support for custom node styles and hover, focus status
* support edge's label style
* support the toolltips of  node, endpoint, edge's label
* support right-click menu of nodes and edges
* support minimap and highlight status

## 📦 Install
```
npm install react-monitor-dag
```
```js
import MonitorDag from 'react-monitor-dag';
import 'react-monitor-dag/dist/index.css';
<MonitorDag
  data={data}
  nodeMenu={menu}                   // Node Right-click Menu Configuration
  edgeMenu={menu}                   // Edge Right-click Menu Configuration
  onClickNode={(node) => {}}        // Single Click Node Event
  onContextmenuNode={(node) => {}}  // Right Click Node Event
  onDblClickNode={(node) => {}}     // Double Click Node Event
  onClickEdge={(edge) => {}}        // Single Click Edge Event
  onContextmenuEdge={(edge) => {}}  // Right Click Edge Event
  polling={{                        // support polling
    enable: true,
    interval: 5000,                 // interval of polling 
    getData: (data) => {            // the method of get data

    }
  }}
  registerStatus={{                 // Register status, which adds class to the node based on its status
    success: 'success-class',
    fail: 'fail-class',
    timeout: 'timeout-class',
    running: 'runnning-class',
    waitting: 'waiting-class',
    other: 'other-class'
  }}
  statusNote={{                      // Status note in upper left corner
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
interface menu { // right-click menu configuration for'Node/Edge'
  title?: string, // name of each column
  key: string, // unique flag for each column menu
  render?(key: string): void, // Customize the style of each column menu
  onClick?(key: string, data: any): void, // Click Callback for Each Column
}

interface config {
  direction: string,  // the dag's direction: 'left-right' or 'top-bottom'
  edge: {         // the configuration of edge
    type: string,
    config: any
  },
  labelRender?(label: JSX.Element): void,  // rendering method of edge's label
  labelTipsRender?(data: any): void,    // rendering tooltips of edge label
  nodeRender?(data: any): void,    // rendering of nodes
  nodeTipsRender?(data: any): void,    // rendering tooltips of node
  endpointTipsRender?(data: any): void,    // rendering tooltips of endpoint
  minimap: {   // whether to show minimap
    enable: boolean,
    config: {
      nodeColor: any, // node color
      activeNodeColor: any // node active color
    }
  }
}

interface props {
  data: any,                           // data
  width?: number | string,             // component width
  height?: number | string,            // component height
  className?: string,                  // component className
  nodeMenu: Array<menu>,               // Node Right-click Menu Configuration
  edgeMenu: Array<menu>,               // Edge Right-click Menu Configuration
  config?: any,                        // As configured above
  polling?: {                          // support polling
    enable: boolean,
    interval: number,                  // interval of polling 
    getData(data): void                // the method of get data
  },
  registerStatus?: {                   // Register status, which adds class to the node based on its status
    success: string,
    fail: string
  },
  statusNote?: {                       // Status note in upper left corner
    enable: boolean,
    notes: [{
      code: string,
      className: string,
      text: string
    }]
  },
  onClickNode?(node: any): void,                 // Single Click Node Event
  onContextmenuNode?(node: any): void,           // Right-Click Node Event
  onDblClickNode?(node: any): void,              // Double Click Node Event
  onClickEdge?(edge: any): void,                 // Single Click Edge Event
  onClickLabel?(label: string, edge: any): void, // Single Click Label Event
  onContextmenuEdge?(edge: any): void,           // Right-Click Edge Event
}
```
