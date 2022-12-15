'use strict';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from 'lodash';
import './index.less';
import 'butterfly-dag/dist/index.css';
import Canvas from './canvas/canvas';
import Edge from './canvas/edge';
import {transformInitData, diffPropsData} from './adaptor';
import AutoLayout from './utils/layout';

// 右键菜单配置
interface menu {
  title?: string,
  key: string,
  render?(key: string): void,
  onClick?(node: any): void,
}

// 画布配置
interface config {
  delayDraw: number, // 延迟加载
  showActionIcon?: boolean,// 是否操作icon：放大，缩小，聚焦
  focusCenter?: boolean, //是否初始化的时候把所有节点居中
  draggable?: boolean, // 是否允许节点拖拽
  diffOptions?: Array<string>, // 更新节点时，需要diff的字段集合（默认节点diff节点id）
  edge?: {        //定制线段的类型，todo需要思考
    type: string,
    config: any,
  },
  group?: {
    enableSearch: boolean,       // 是否开启节点组搜索节点
    pageSize: number,            // 每页的数量
    rowCnt: number               // 节点组每行展示多少个节点
  },
  statusNote?: {
    enable: boolean,
    notes: [{
      code: string,
      className: string,
      text: string,
      render?:() => JSX.Element
    }]
  },
  labelRender?(label: string): JSX.Element,  // 自定义label样式，没定义使用默认样式
  nodeRender?(data: any): JSX.Element,      // 自定义节点样式，没定义使用默认样式
  onSearchGroup?(keywork: string, nodeList: any)
  autoLayout?: {
    enable: boolean,   // 是否开启自动布局
    isAlways: boolean, // 是否添加节点后就重新布局, todo
    config: any   // 算法配置
  },
  minimap: {  // 是否开启缩略图
    enable: boolean,
    config: {
      nodeColor: any
    }
  }
}

interface ComProps {
  data: any,                           // 画布数据
  width?: number | string,             // 组件宽
  height?: number | string,            // 组件高
  className?: string,                  // 组件classname
  nodeMenu: Array<menu> | ((node) => Array<menu>), // 节点右键菜单配置
  nodeMenuClassName?: string,              //  节点菜单样式
  edgeMenu: Array<menu>,            // 线段右键菜单配置
  groupMenu: Array<menu>,              // group右键配置
  config?: config,                        // 画布配置
  polling?: {                          // 支持轮训
    enable: boolean,
    interval: number,
    getData(data): void
  },
  registerStatus?: {                   // 自行注册状态，会根据node的status给节点加上class
    success: string,
    fail: string,
    // key:value的形式，可以自行注册，和node的status字段对应起来
  },
  onClickNode?(node: any): void,                 // 单击节点事件
  onClickCanvas?():void,                         // 点击画布空白处事件
  onContextmenuNode?(node: any): void,           // 右键节点事件
  onDblClickNode?(node: any): void,              // 双击节点事件
  onClickEdge?(edge: any): void,                 // 单击线段事件
  onClickLabel?(label: string, edge: any): void, //单击label的事件
  onContextmenuEdge?(edge: any): void,           // 右键线段事件
  onContextmenuGroup?(edge: any): void,           // 右键线段事件
  onChangePage?(data:any): void,                 // 分页事件
  onLoaded?(data: any): void                              // 画布加载完成之后的回调
}

export default class MonitorDag extends React.Component<ComProps, any> {
  protected canvas: any;
  protected canvasData: any;
  protected group: any;
  private _timer: any;
  private _focusNodes: any;
  private _focusLinks: any;
  private _statusNote: any;
  props: any;
  constructor(props: ComProps) {
    super(props);
    this.canvas = null;
    this.canvasData = null;

    this._focusNodes = [];
    this._focusLinks = [];

    this._timer = null;

    this._statusNote = {
      success: {
        className: 'success',
        text: '成功'
      },
      fail: {
        className: 'fail',
        text: '失败'
      },
      timeout: {
        className: 'timeout',
        text: '超时'
      },
      running: {
        className: 'running',
        text: '正在运行'
      },
      waiting: {
        className: 'waiting',
        text: '等待中'
      }
    };
  }
  componentDidMount() {
    let root = ReactDOM.findDOMNode(this) as HTMLElement;
    if (this.props.width !== undefined) {
      root.style.width = this.props.width + 'px';
    }
    if (this.props.height !== undefined) {
      root.style.height = this.props.height + 'px';
    }
    let result = transformInitData({
      config: this.props.config,
      nodeMenu: this.props.nodeMenu,
      edgeMenu: this.props.edgeMenu,
      groupMenu: this.props.groupMenu,
      nodeMenuClassName: this.props.nodeMenuClassName,
      data: _.cloneDeep(this.props.data || {nodes: [], edges: [], groups: []}),
      registerStatus: _.cloneDeep(this.props.registerStatus)
    });
    let canvasObj = ({
      root: root,
      disLinkable: false,
      linkable: false,
      draggable: _.get(this.props, 'config.draggable', true),
      zoomable: true,
      moveable: true,
      theme: {
        edge: {
          // todo,
          type: 'endpoint',
          shapeType: _.get(this, 'props.config.edge.shapeType', 'AdvancedBezier'),
          isExpandWidth: true,
          arrow: _.get(this, 'props.config.edge.config.arrow', true),
          arrowPosition: _.get(this, 'props.config.edge.config.arrowPosition', 1),
          arrowOffset: _.get(this, 'props.config.edge.config.arrowPosition', -8),
          Class: Edge
        },
      },
      extraConfig: {
        group: {
          enablePagination: _.get(this, 'props.config.group.enablePagination', true),
          pageSize: _.get(this, 'props.config.group.pageSize', 20),
          rowCtn: _.get(this.props, 'config.group.rowCnt', 5),
          onSearchGroup: _.get(this.props, 'config.onSearchGroup'),
        }
      }
    });

    this.canvas = new Canvas(canvasObj);

    if (_.get(this.props, 'config.autoLayout.enable', false)) {
      let data = AutoLayout(result, {
        rankdir: _.get(this.props, 'config.direction', 'top-bottom') === 'top-bottom' ? 'TB' : 'LR',
        align: _.get(this.canvas.layout, 'options.align'),
        nodeSize: _.get(this.canvas.layout, 'options.nodeSize'),
        nodesepFunc: _.get(this.canvas.layout, 'options.nodesepFunc'),
        ranksepFunc: _.get(this.canvas.layout, 'options.ranksepFunc'),
        nodesep: _.get(this.canvas.layout, 'options.nodesep') || 50,
        ranksep: _.get(this.canvas.layout, 'options.ranksep') || 50,
        controlPoints: _.get(this.canvas.layout, 'options.controlPoints') || false,
      }, {
        rowCtn: _.get(this.props, 'config.group.rowCnt')
      });

      // canvasObj['layout'] = {
      //   type: 'dagreLayout',
      //   options: {
      //     rankdir: _.get(this.props, 'config.direction', 'top-bottom') === 'top-bottom' ? 'TB' : 'LR',
      //     nodesep: 40,
      //     ranksep: 40
      //   }
      // };
    }

    setTimeout(() => {
      this.canvas.draw(result, (data) => {
        this.props.onLoaded && this.props.onLoaded(data);
        let minimap = _.get(this, 'props.config.minimap', {});
        const minimapCfg = _.assign({}, minimap.config, {
          events: [
            'system.node.click',
            'system.canvas.click'
          ]
        });
        if (minimap && minimap.enable) {
          this.canvas.setMinimap(true, minimapCfg);
        }
        if (_.get(this, 'props.config.focusCenter')) {
          this.canvas.focusCenterWithAnimate();
        }
      });  
    }, _.get(this.props, 'config.delayDraw', 0));
    
    this.canvas.on('events', (data) => {
      // console.log(data);
    });
    this.canvasData = result;

    // 监听事件
    this.canvas.on('system.node.click', (data: any) => {
      this._focusNode([data.node]);
      this.props.onClickNode && this.props.onClickNode(data.node);
    });

    this.canvas.on('custom.node.rightClick', (data: any) => {
      this.props.onContextmenuNode && this.props.onContextmenuNode(data.node);
    });

    this.canvas.on('custom.node.dblClick', (data: any) => {
      this.props.onDblClickNode && this.props.onDblClickNode(data.node);
    });

    this.canvas.on('custom.edge.rightClick', (data: any) => {
      this.props.onContextmenuEdge && this.props.onContextmenuEdge(data.edge);
    });

    this.canvas.on('system.link.click', (data: any) => {
      this._focusLink([data.edge]);
      this.props.onClickEdge && this.props.onClickEdge(data.edge);
    });

    this.canvas.on('custom.edge.labelClick', (data: any) => {
      this._focusLink([data.edge]);
      this.props.onClickLabel && this.props.onClickLabel(data.label, data.edge);
    });

    this.canvas.on('system.canvas.click', (data: any) => {
      this._unfocus();
      this.props.onClickCanvas && this.props.onClickCanvas();
    });

    this.canvas.on('custom.groups.rightClick', (data: any) => {
      this.props.onContextmenuGroup && this.props.onContextmenuGroup(data.groups);
    });
    
    // 检测轮训
    this._polling();
  }
  shouldComponentUpdate(newProps: ComProps, newState: any) {
    let result = transformInitData({
      config: this.props.config,
      nodeMenu: this.props.nodeMenu,
      edgeMenu: this.props.edgeMenu,
      groupMenu: this.props.groupMenu,
      nodeMenuClassName: this.props.nodeMenuClassName,
      data: _.cloneDeep(newProps.data),
      registerStatus: _.cloneDeep(newProps.registerStatus)
    });
    let diffInfo = diffPropsData(result, this.canvasData, _.get(this, 'props.config.diffOptions', []));
    if (diffInfo.rmNodes.length > 0) {
      this.canvas.removeNodes(diffInfo.rmNodes.map(item => item.id));
    }
    if (diffInfo.addNodes.length > 0) {
      this.canvas.addNodes(diffInfo.addNodes);
    }
    if(diffInfo.updateNodes.length > 0) {
      let removeData = this.canvas.removeNodes(diffInfo.updateNodes.map(item => item.id), false, true);
      let _addNodes = this.canvas.addNodes(diffInfo.updateNodes, true);
      _addNodes.forEach(item => {
        item.mounted && item.mounted();
      });
      this.canvas.addEdges(removeData.edges.map(edge => {
        return edge.options;
      }), true);
    }
    if (diffInfo.addEdges.length > 0) {
      this.canvas.addEdges(diffInfo.addEdges);
    }
    if (diffInfo.rmEdges.length > 0) {
      this.canvas.removeEdges(diffInfo.rmEdges.map(item => item.id));
    }
    if (diffInfo.updateStatus.length > 0) {
      diffInfo.updateStatus.forEach((item) => {
        let node = this.canvas.getNode(item.node.id);
        if (node) {
          node.updateStatusPoint(node.status);
        }
      });
    }

    if (
      _.get(this.props, 'config.autoLayout.isAlways', false) && (
        diffInfo.addNodes.length > 0 ||
        diffInfo.rmNodes.length > 0 ||
        diffInfo.addEdges.length > 0 ||
        diffInfo.rmEdges.length > 0
      )
    ) {
      this.canvas.redraw();
    }

    this.canvasData = result;

    // 检测轮训
    this._polling(newProps.polling);

    return true;
  }
  componentWillUnmount() {

  }

  render() {
    return (
      <div
        className={this._genClassName()}
      >
        {this._createStatusNote()}
        {this._createActionIcon()}
      </div>
    )
  }

  _createStatusNote() {
    let isShow = _.get(this, 'props.config.statusNote.enable', true);
    if (isShow) {
      let statusNote = _.get(this, 'props.config.statusNote.notes');
      if (statusNote) {
        this._statusNote = statusNote;
      }
      let result = [];
      for(let key in this._statusNote) {
        if(typeof _.get(this._statusNote, `${key}.render`) === 'function') {
          result.push(
            <span className='status-box'>
              {this._statusNote[key].render()}
            </span>
          )
        } else {
          result.push(
            <span className='status-box'>
              <span className={`status-point ${this._statusNote[key].className}`}></span>
              <span className="status-text">{this._statusNote[key].text}</span>
            </span>
          );
        }
      }
      return (
        <div className="status-container">
          {result}
        </div>
      );
    }
  }
  _createActionIcon() {
    let isShow = _.get(this, 'props.config.showActionIcon', true);
    if (isShow) {
      return (
        <div className='monitor-canvas-action'>
          <div
            onClick={() => {
              this.canvas.zoom(this.canvas._zoomData + 0.1);
            }}
          >
            <i className="monitor-icon monitor-icon-zoom-in"></i>
          </div>
          <div
            onClick={() => {
              this.canvas.zoom(this.canvas._zoomData - 0.1);
            }}
          >
            <i className="monitor-icon monitor-icon-zoom-out"></i>
          </div>
          <div
            onClick={() => {
              this.canvas.focusCenterWithAnimate();
            }}>
              <i className="monitor-icon monitor-icon-quanping2"></i>
          </div>
        </div>
      );
    }
    return null;
  }
  _genClassName() {
    let classname = '';
    if (this.props.className) {
      classname = this.props.className + ' butterfly-monitor-dag';
    } else {
      classname = 'butterfly-monitor-dag';
    }
    return classname;
  }
  _polling(pollingCfg = this.props.polling || {}) {
    if (!pollingCfg.enable) {
      if (this._timer) {
        clearInterval(this._timer);
      }
    } else {
      if (!this._timer) {
        this._timer = setInterval(() => {
          pollingCfg.getData(this.canvas.getDataMap());
        }, pollingCfg.interval);
      }
    }
  }
  // 聚焦节点
  _focusNode(nodes) {
    this._unfocus();
    nodes.forEach((node) => {
      node.focus();
    });
    this._focusNodes = this._focusNodes.concat(nodes);
  }
  // 聚焦线段
  _focusLink(edges) {
    this._unfocus();
    edges.forEach((edge) => {
      edge.focus();
    });
    this._focusLinks = this._focusLinks.concat(edges);
  }
  // 失焦
  _unfocus() {
    this._focusNodes.forEach((item) => {
      item.unfocus();
    });
    this._focusLinks.forEach((item) => {
      item.unfocus();
    });
    this._focusNodes = [];
    this._focusLinks = [];
  }
}
