'use strict';
import { Canvas, Layout } from 'butterfly-dag';
import AutoLayout, {calcGroupNodesPos} from '../utils/layout';

export default class MonitorCanvas extends Canvas {
  constructor(opts) {
    super(opts);

    // group的分页处理
    this._groupEnablePagination = opts.extraConfig.group.enablePagination
    this._groupPageSize = opts.extraConfig.group.pageSize;
    this._groupRowCnt = opts.extraConfig.group.rowCnt;
    this._onSearchGroup = opts.extraConfig.group.onSearchGroup;
    this._onChangePage = opts.extraConfig.onChangePage;
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
  redraw() {
    let nodes = this.nodes.map((item) => {
      return item.options;
    });
    let groups = this.groups.map((item) => {
      return {
        id: item.id,
        width: item.width,
        height: item.height,
        isGroup: true
      }
    });
    let edges = this.edges.map((item) => {
      return {
        sourceNode: item.sourceNode.id,
        targetNode: item.targetNode.id
      }
    });

    AutoLayout({
      nodes: nodes,
      groups: groups,
      edges: edges
    }, {
      rankdir: _.get(this.layout, 'options.rankdir') || 'TB',
      align: _.get(this.layout, 'options.align'),
      nodeSize: _.get(this.layout, 'options.nodeSize'),
      nodesepFunc: _.get(this.layout, 'options.nodesepFunc'),
      ranksepFunc: _.get(this.layout, 'options.ranksepFunc'),
      nodesep: _.get(this.layout, 'options.nodesep') || 50,
      ranksep: _.get(this.layout, 'options.ranksep') || 50,
      controlPoints: _.get(this.layout, 'options.controlPoints') || false,
    }, {
      rowCnt: this._groupRowCnt
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

    this.groups.forEach((item, index) => {
      let newLeft = groups[index].left;
      let newTop = groups[index].top;
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
    calcGroupNodesPos(showList, {
      rowCnt: ROW_CNT
    });

    this.removeNodes(rmNodes, true);
    this.addNodes(addNodes, true);

    this._onChangePage({
      nodes: group._showNodeList,
      groupObj: group,
      pageNum: group._pageNum,
      pageSize: group._pageSize,
      totalNum: group._totalNum,
      keyword: group._keyword
    })

    group._updateTotalCnt();
  }
};
