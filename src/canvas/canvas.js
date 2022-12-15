'use strict';
import { Canvas, Layout } from 'butterfly-dag';
import {Node} from './node';

export default class MonitorCanvas extends Canvas {
  constructor(opts) {
    super(opts);

    // group的分页处理
    this._groupEnablePagination = opts.extraConfig.group.enablePagination
    this._groupPageSize = opts.extraConfig.group.pageSize;
    this._groupRowCnt = opts.extraConfig.group.rowCtn;
    this._onSearchGroup = opts.extraConfig.group.onSearchGroup;
  }
  _addEventListener() {
    super._addEventListener();
    this.on('custom.groups.changePage', (data) => {
      this.updateGroupPage(data.group);
    })
  }
  addGroup(group, unionItems, options, isNotEventEmit, isNotRedrawByVirtualScroll) {
    let result = super.addGroup(group, unionItems, options, isNotEventEmit, isNotRedrawByVirtualScroll);
    result._onSearchGroup = this._onSearchGroup;
    return result;
  }
  draw(opts, callback) {

    // group的分页处理
    if (this._groupEnablePagination && opts.groups && opts.groups.length > 0) {

      let _groupsObj = {};
      let _groupHiddenNodes = {};

      for(let i = 0; i < opts.groups.length; i++) {
        let _group = opts.groups[i];
        if (!_groupsObj[_group.id]) {
          _groupsObj[_group.id] = [];
        }
      }
      for(let i = 0; i < opts.nodes.length; i++) {
        let _node = opts.nodes[i];
        if (_node.group) {
          _groupsObj[_node.group].push(_node);
        }
      }

      opts.groups.forEach((item) => {
        let nodes = _groupsObj[item.id];
        item._enablePagination = this._groupEnablePagination;
        item._allNodeList = item._showNodeList = nodes;
        item._pageSize = this._groupPageSize;
        item._pageNum = 1;
        item._totolNum = nodes.length;
      });

      let _rmNodes = [];
      for(let key in _groupsObj) {
        let _group = _groupsObj[key];
        _rmNodes = _rmNodes.concat(_group.slice(this._groupPageSize, _group.length));
      }
      
      opts.nodes = opts.nodes.filter((item) => {
        let isRmNode = _.some(_rmNodes, (node) => node.id === item.id);
        if (isRmNode) {
          _groupHiddenNodes[item.id] = item;
        }
        return !isRmNode;
      });
    }

    super.draw(opts, callback);
  }
  redraw() {
    let nodes = this.nodes.map((item) => {
      return item.options;
    });
    let edges = this.edges.map((item) => {
      return {
        source: item.sourceNode.id,
        target: item.targetNode.id
      }
    });
    Layout.dagreLayout({
      rankdir: _.get(this.layout, 'options.rankdir') || 'TB',
      align: _.get(this.layout, 'options.align'),
      nodeSize: _.get(this.layout, 'options.nodeSize'),
      nodesepFunc: _.get(this.layout, 'options.nodesepFunc'),
      ranksepFunc: _.get(this.layout, 'options.ranksepFunc'),
      nodesep: _.get(this.layout, 'options.nodesep') || 50,
      ranksep: _.get(this.layout, 'options.ranksep') || 50,
      controlPoints: _.get(this.layout, 'options.controlPoints') || false,
      data: {
        nodes: nodes,
        edges: edges.map(item => ({
          source: item.type === 'endpoint' ? item.sourceNode : item.source,
          target: item.type === 'endpoint' ? item.targetNode : item.target
        }))
      }
    });
    this.nodes.forEach((item, index) => {
      let newLeft = nodes[index].left;
      let newTop = nodes[index].top;
      if (item.top !== newTop || item.left !== newLeft) {
        item.options.top = newTop;
        item.options.left = newLeft;
        item.moveTo(newLeft, newTop);
      }
    });
    this.focusCenterWithAnimate();
  }

  updateGroupPage(group) {
    let showList = group._showNodeList;
    let currentNodesList = this.nodes.filter((item) => {
      return item.group === group.id;
    });

    let rmNodes = currentNodesList.filter((item) => {
      return !_.some(showList, (_node) => item.id === _node.id);
    });
    let addNodes = showList.filter((item) => {
      return !_.some(currentNodesList, (_node) => item.id === _node.id);
    });

    const ROW_CNT = this._groupRowCnt || 5;
    showList.forEach((item, i) => {
      let row = parseInt(i / ROW_CNT);
      let col = i % ROW_CNT;
      item.top = row * 50;
      item.left = col * 160;
    });
    // 加group的padding
    showList.forEach((item) => {
      item.top += 50;
      item.left += 10;
    });

    this.removeNodes(rmNodes, true);
    this.addNodes(addNodes, true);

    group._updateTotalCnt();
  }
};
