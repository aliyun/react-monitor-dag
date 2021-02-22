'use strict';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from 'lodash';
import './index.less';
import 'butterfly-dag/dist/index.css';
import Canvas from './src/canvas/canvas';
import Edge from './src/canvas/edge';

import {transformInitData, diffPropsData} from './src/adaptor';

// 右键菜单配置
interface menu {
  title?: string,
  key: string,
  render?(key: string): void,
  onClick?(node: any): void,
}

// 画布配置
interface config {
  showActionIcon?: boolean,// 是否操作icon：放大，缩小，聚焦
  edge?: {         //定制线段的类型，todo需要思考
    type: string,
    config: any
  },
  labelRender?(label: string): JSX.Element,  // 自定义label样式，没定义使用默认样式
  nodeRednder?(data: any): JSX.Element,      // 自定义节点样式，没定义使用默认样式
  // todo: 宇行，需要在shouldComponentUpdate的时候判断
  autoLayout: {
    enable: boolean,   // 是否开启自动布局
    isAlways: boolean, // 是否添加节点后就重新布局
    type: string, // 算法类型
    config: any   // 算法配置
  },
  minimap: {   // 是否开启缩略图
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
  nodeMenu: Array<menu>,               // 节点右键菜单配置
  edgeMenu: Array<menu>,               // 线段右键菜单配置
  config?: any,                        // 画布配置
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
  statusNote?: {
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
}

export default class MonitorDag extends React.Component<ComProps, any> {
  protected canvas: any;
  protected canvasData: any;
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
      data: _.cloneDeep(this.props.data),
      registerStatus: _.cloneDeep(this.props.registerStatus)
    });
    this.canvas = new Canvas({
      root: root,
      disLinkable: false,
      linkable: false,
      draggable: false,
      zoomable: true,
      moveable: true,
      theme: {
        edge: {
          // todo
          type: _.get(this, 'props.config.edge.type', 'AdvancedBezier'),
          isExpandWidth: true,
          arrow: _.get(this, 'props.config.edge.config.arrow', true),
          arrowPosition: _.get(this, 'props.config.edge.config.arrowPosition', 1),
          arrowOffset: _.get(this, 'props.config.edge.config.arrowPosition', -8),
          Class: Edge
        }
      }
    });
    this.canvas.draw(result, () => {
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
    });
    this.canvasData = result;

    // 监听事件
    this.canvas.on('system.node.click', (data: any) => {
      this._focusNode(data.node);
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
      this._focusLink(data.edge);
      this.props.onClickEdge && this.props.onClickEdge(data.edge);
    });

    this.canvas.on('custom.edge.labelClick', (data: any) => {
      this._focusLink(data.edge);
      this.props.onClickLabel && this.props.onClickLabel(data.label, data.edge);
    });

    this.canvas.on('system.canvas.click', (data: any) => {
      this._unfocus();
    });
    
    // 检测轮训
    this._polling();
  }
  shouldComponentUpdate(newProps: ComProps, newState: any) {

    let result = transformInitData({
      config: this.props.config,
      nodeMenu: this.props.nodeMenu,
      edgeMenu: this.props.edgeMenu,
      data: _.cloneDeep(newProps.data),
      registerStatus: _.cloneDeep(newProps.registerStatus)
    });
    let diffInfo = diffPropsData(result, this.canvasData);
    if (diffInfo.addNodes.length > 0) {
      this.canvas.addNodes(diffInfo.addNodes);
    }
    if (diffInfo.rmNodes.length > 0) {
      this.canvas.removeNodes(diffInfo.rmNodes);
    }
    if (diffInfo.addEdges.length > 0) {
      this.canvas.addEdges(diffInfo.addEdges);
    }
    if (diffInfo.rmEdges.length > 0) {
      this.canvas.removeEdges(diffInfo.rmEdges);
    }
    if (diffInfo.updateStatus.length > 0) {
      diffInfo.updateStatus.forEach((item) => {
        let node = this.canvas.getNode(item.node.id);
        if (node) {
          node.updateStatusPoint(node.status);
        }
      });
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
        result.push(
          <span className='status-box'>
            <span className={`status-point ${this._statusNote[key].className}`}></span>
            <span className="status-text">{this._statusNote[key].text}</span>
          </span>
        );
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
  _focusNode(node) {
    this._unfocus();
    node.focus();
    this._focusNodes.push(node);
  }
  // 聚焦线段
  _focusLink(edge) {
    this._unfocus();
    edge.focus();
    this._focusLinks.push(edge);
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