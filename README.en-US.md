<h3 align="center">
  A React-based Operations/Monitoring DAG Diagram
</h3>

English| [简体中文](. /README. md)

<p align="center">
  <img width="100%" src="https://img.alicdn.com/imgextra/i2/O1CN01eJigoL1gd9tjRSvdi_!!6000000004164-1-tps-1665-826.gif">
</p>

## ✨ Feature

* support the direction of left-to-right, top-to-bottom
* support for custom status, custom status note in upper left corner
* support for custom node styles and hover, focus status
* support edge's label style
* support the toolltips of  node, endpoint, edge's label
* support right-click menu of nodes and edges
* support minimap and highlight status
* support edge flow animation

## 📦 Install

``` 
npm install react-monitor-dag
```

## API<a name='canvas-attr'></a>：

### <b>MonitorDag properties</b>

|      Property     |                            Description                            |                               Type                              |                                 Default                                 |
|:-----------------:|:-----------------------------------------------------------------:|:---------------------------------------------------------------:|:-----------------------------------------------------------------------:|
|        data       |                                data                               |                 <font color="c41d7f">any</font>                 |                                    -                                    |
|       width       |                          component width                          |         <font color="c41d7f">number &#124; string</font>        |                                    -                                    |
|       height      |                          component height                         |        <font color="c41d7f">number &#124; string </font>        |                                    -                                    |
|     className     |                        component className                        |                <font color="c41d7f">string</font>               |                                    -                                    |
|      nodeMenu     |                Node Right-click Menu Configuration                | <font color="c41d7f">Array&#60; [menu](#menu-type)&#62; &#124; (node) =>  Array&#60; [menu](#menu-type)&#62; </font> |                                   -                                   |
|  nodeMenuClassName  |   Node Right-click Menu classname     |    <font color="c41d7f">string</font>    |    -    |
|      edgeMenu     |                Edge Right-click Menu Configuration                | <font color="c41d7f">Array&#60; [menu]
|      groupMenu     |                Group Right-click Menu Configuration                | <font color="c41d7f">Array&#60; [menu]
(#menu-type)&#62; </font> |                                   [ ]                                   |
|       config      |             As configured above[config Prop](#config)             |                 <font color="c41d7f">any </font>                |                                    -                                    |
|      polling      |              support polling[polling Prop](#polling)              |                <font color="c41d7f">object</font>               |                                   { }                                   |
|   registerStatus  | Register status, which adds class to the node based on its status |                <font color="c41d7f">object</font>               | key:value, registered by user, corresponded to the status field of node |
|     statusNote    |   Status note in upper left corner[statusNote Prop](#statusNote)  |                <font color="c41d7f">object</font>               |                                   { }                                   |
|    onClickNode    |                      Single Click Node Event                      |            <font color="c41d7f">(node) => void</font>           |                                    -                                    |
| onContextmenuNode |                       Right-Click Node Event                      |            <font color="c41d7f">(node) => void</font>           |                                    -                                    |
|   onDblClickNode  |                      Double Click Node Event                      |            <font color="c41d7f">(node) => void</font>           |                                    -                                    |
|    onClickEdge    |                      Single Click Edge Event                      |            <font color="c41d7f">(edge) => void</font>           |                                    -                                    |
|    onClickLabel   |                      Single Click Label Event                     |        <font color="c41d7f">(label, edge) => void</font>        |                                    -                                    |
| onContextmenuEdge |                       Right-Click Edge Event                      |            <font color="c41d7f">(edge) => void</font>           |                                    -                                    |
| onContextmenuGroup |                       Right-Click Group Event                      |            <font color="c41d7f">(data) => void</font>           |  
| onChangePage |                             Single-Click Group Pagination Event                      |            <font color="c41d7f">(data) => void</font>           | 


<br>
### <a name='menu-type'></a><b>menu</b>

right-click menu configuration for'Node/Edge'

| Property |               Description               |                       Type                      | Default |
|:--------:|:---------------------------------------:|:-----------------------------------------------:|:-------:|
|   title  |           name of each column           |        <font color="c41d7f">string</font>       |    -    |
|    key   |     unique flag for each column menu    |        <font color="c41d7f">string</font>       |    -    |
|  render  | Customize the style of each column menu |    <font color="c41d7f">(key) => void</font>    |    -    |
|  onClick |      Click Callback for Each Column     | <font color="c41d7f">(key, data) => void</font> |    -    |

<br>

### <a name='config'></a><b>config</b>

the configuration of canvas

|      Property      |            Description           |                              Type                             |              Default              |
|:------------------:|:--------------------------------:|:-------------------------------------------------------------:|:---------------------------------:|
|      direction     |        the dag's direction       |               <font color="c41d7f">string</font>              | `left-right` &#124; `top-bottom` |
|        edge        |     the configuration of edge    |    [edge Prop](#edge-prop)<font color="c41d7f"> { }</font>    |                 -                 |
|     labelRender    | rendering method of edge's label |          <font color="c41d7f">(label) => void</font>          |                 -                 |
|   labelTipsRender  | rendering tooltips of edge label |           <font color="c41d7f">(data) => void</font>          |                 -                 |
|     nodeRender     |        rendering of nodes        |           <font color="c41d7f">(data) => void</font>          |                 -                 |
|   nodeTipsRender   |    rendering tooltips of node    |           <font color="c41d7f">(data) => void</font>          |                 -                 |
| endpointTipsRender |  rendering tooltips of endpoint  |           <font color="c41d7f">(data) => void</font>          |                 -                 |
|       minimap      |      whether to show minimap     | [minimap Prop](#minimap-prop)<font color="c41d7f"> { }</font> |                 -                 |
|       delayDraw      |      Delayed rendering. This component must ensure that the canvas container rendering (including animation execution) is completed before rendering, otherwise the coordinates will be offset, for example：Animation of Ant Design Modal     | <font color="c41d7f"> number</font> |                 0                 |
|       autoLayout      |    custom layout    | [autoLayout Prop](#auto-layout-prop)<font color="c41d7f"> {}</font> |                 -               |
|  diffOptions | Collection of diff fields for node updates| Array&#60; string&#62; | - |
|  onLoaded | canvas loaded event| (data: {nodes, edges, groups}) => {} | - |

<br>

### <a name='edge-prop'></a><b>edge</b>

the configuration of edge

| Property |     Description    |                Type                | Default |
|:--------:|:------------------:|:----------------------------------:|:-------:|
|   type   |  the type of edge  | <font color="c41d7f">string</font> |    -    |
|  config  | the config of edge |  <font color="c41d7f"> any</font>  |    -    |

<br>

### <a name='group-prop'></a><b>group</b>

the configuration of group

|  Property  |   Description   |                Type                | Default |
|:------:|:--------:|:----------------------------------:|:-----:|
|  enableSearch  | whether to enable the node group search node | <font color="c41d7f">boolean</font> |   false   |
| enablePagination | whether to turn on the page |  <font color="c41d7f"> boolean </font>  |   true   |
| pageSize | nmber of per page |  <font color="c41d7f"> number </font>  |   20   |
| rowCnt | the number of nodes are displayed in each row of the node group |  <font color="c41d7f"> number </font>  |   5   |

<br>

### <a name='minimap-prop'></a><b>minimap</b>

the configuration of minimap

| Property |       Description       |                                     Type                                    | Default |
|:--------:|:-----------------------:|:---------------------------------------------------------------------------:|:-------:|
|  enable  | whether to show minimap |                     <font color="c41d7f">boolean</font>                     |    -    |
|  config  |  the config of minimap  | [minimap Config Prop](#minimap-config-prop)<font color="c41d7f"> { }</font> |    -    |

<br>

### <a name='auto-layout-prop'></a><b>autoLayout Config</b>

the custom layout config

| Property |       Description       |   Type         | Default |
|:--------:|:-----------------------:|:-------------------------------:|:-------:|
|    enable    |   whether to enable custom layout  | <font color="c41d7f">boolean</font> |   -   |
| isAlways | whether to rearrange the layout after adding nodes | <font color="c41d7f">boolean</font> |   -   |
| config | algorithm configuration | <font color="c41d7f">{ }</font> |   -   |

<br>

### <a name='minimap-config-prop'></a><b>minimap Config</b>

the config of minimap

|     Property    |    Description    |               Type              | Default |
|:---------------:|:-----------------:|:-------------------------------:|:-------:|
|    nodeColor    |     node color    | <font color="c41d7f">any</font> |    -    |
| activeNodeColor | node active color | <font color="c41d7f">any</font> |    -    |

<br>

### <a name='polling'></a><b>polling</b>

support polling

| Property |         Description        |                    Type                    | Default |
|:--------:|:--------------------------:|:------------------------------------------:|:-------:|
|  enable  | whether to support polling |     <font color="c41d7f">boolean</font>    |    -    |
| interval |     interval of polling    |     <font color="c41d7f">number</font>     |    -    |
|  getData |   the method of get data   | <font color="c41d7f">(data) => void</font> |    -    |

<br>

### <a name='statusNote'></a><b>statusNote</b>

Status note in upper left corner

| Property |                 Description                 |                            Type                           | Default |
|:--------:|:-------------------------------------------:|:---------------------------------------------------------:|:-------:|
|  enable  | whether to show status in upper left corner |            <font color="c41d7f">boolean</font>            |    -    |
|   notes  |       the configuration of status note      | [notes Prop](#notes-prop)<font color="c41d7f"> { }</font> |    -    |

<br>

### <a name='notes-prop'></a><b>notes</b>

the configuration of status note 

|  Property |    Description   |                 Type                | Default |
|:---------:|:----------------:|:-----------------------------------:|:-------:|
|    code   |    status code   |  <font color="c41d7f">string</font> |    -    |
| className | status className | <font color="c41d7f"> string</font> |    -    |
|    text   |    status text   |  <font color="c41d7f">string</font> |    -    |
|   render  | custom rendering methods |  <font color="c41d7f">function</font> |    -    |

<br>

## 🔗API

``` jsx
import MonitorDag from 'react-monitor-dag';
import 'react-monitor-dag/dist/index.css';
<MonitorDag
  data={data}
  nodeMenu={menu}                   // Node Right-click Menu Configuration
  edgeMenu={menu}                   // Edge Right-click Menu Configuration
  groupMenu={menu}                   // Group Right-click Menu Configuration
  onClickNode={(node) => {}}        // Single Click Node Event
  onContextmenuNode={(node) => {}}  // Right Click Node Event
  onDblClickNode={(node) => {}}     // Double Click Node Event
  onClickEdge={(edge) => {}}        // Single Click Edge Event
  onContextmenuEdge={(edge) => {}}  // Right Click Edge Event
  onContextmenuGroup={(data) => {}}   // Right Click Group Event
  onChangePage={(data) => {}}        // Single Click Group Pagination Event
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
      text: '运行成功',
    }]
  }}
>
</MonitorDag>
```

``` js
interface menu { // right-click menu configuration for'Node/Edge'
  title ? : string, // name of each column
    key: string, // unique flag for each column menu
    render ? (key: string) : void, // Customize the style of each column menu
    onClick ? (key: string, data: any) : void, // Click Callback for Each Column
}

interface config {
  direction: string, // the dag's direction: 'left-right' or 'top-bottom'
    edge: { // the configuration of edge
      type: string,
      config: any
    },
    labelRender ? (label: JSX.Element) : void, // rendering method of edge's label
    labelTipsRender ? (data: any) : void, // rendering tooltips of edge label
    nodeRender ? (data: any) : void, // rendering of nodes
    nodeTipsRender ? (data: any) : void, // rendering tooltips of node
    endpointTipsRender ? (data: any) : void, // rendering tooltips of endpoint
    minimap: { // whether to show minimap
      enable: boolean,
      config: {
        nodeColor: any, // node color
        activeNodeColor: any // node active color
      }
    }
}

interface props {
  data: any, // data
    width ? : number | string, // component width
    height ? : number | string, // component height
    className ? : string, // component className
    nodeMenu: Array < menu > , // Node Right-click Menu Configuration
    edgeMenu: Array < menu > , // Edge Right-click Menu Configuration
    groupMenu: Array < menu > , // Group Right-click Menu Configuration
    config ? : any, // As configured above
    polling ? : { // support polling
      enable: boolean,
      interval: number, // interval of polling 
      getData(data): void // the method of get data
    },
    registerStatus ? : { // Register status, which adds class to the node based on its status
      success: string,
      fail: string
    },
    statusNote ? : { // Status note in upper left corner
      enable: boolean,
      notes: [{
        code: string,
        className: string,
        text: string,
        render?:() => JSX.Element
      }]
    },
    onClickNode ? (node: any) : void, // Single Click Node Event
    onContextmenuNode ? (node: any) : void, // Right-Click Node Event
    onDblClickNode ? (node: any) : void, // Double Click Node Event
    onClickEdge ? (edge: any) : void, // Single Click Edge Event
    onClickLabel ? (label: string, edge: any) : void, // Single Click Label Event
    onContextmenuEdge ? (edge: any) : void, // Right-Click Edge Event
    onContextmenuGroup?(edge: any): void,   // Right-Click Group Event
    onChangePage?(data:any): void,          // Single-Click Group Pagination Event
}
```

If you need more customized requirements, you can refer to issue or [butterfly](https://github.com/alibaba/butterfly/blob/master/README.en-US.md) to customize your needs
