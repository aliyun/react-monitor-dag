'use strict';

import _ from 'lodash';

import { Layout } from 'butterfly-dag';

const layout = (data, options, extraOpts) => {
  let {nodes, groups, edges} = data;
  let layputOpts = {};

  const DEFUALT_NODE_WIDTH = 140;
  const DEFUALT_NODE_HEIGHT = 32;
  const DEFAULT_GROUP_NODE_W_INTERVAL = 15;
  const DEFAULT_GROUP_NODE_H_INTERVAL = 15;

  // 把节点组里面的节点过滤掉
  let innerNodes = nodes.filter((item) => item.group);
  let outerNodes = nodes.filter((item) => !item.group);
  let newEdges = edges.filter((item) => {
    return !_.some(innerNodes, (_node) => {
      return item.sourceNode === item.id || item.targetNode === item.id;
    })
  });
  // 把节点组当作一个大的节点
  outerNodes = outerNodes.concat(groups.map((item) => {
    item.isGroup = true;
    return item;
  })).map((item) => {
    if (!item.width) {
      item.width = DEFUALT_NODE_WIDTH;
    }
    if (!item.height) {
      item.height = DEFUALT_NODE_HEIGHT;
    }
    return item;
  });

  let opts = _.assign({
    data: {
      nodes: outerNodes,
      edges: newEdges.map((item) => {
        return {
          source: item.sourceNode,
          target: item.targetNode
        }
      })
    }
  }, layputOpts, options);

  Layout.dagreLayout(opts);
  opts.data.nodes.forEach((item) => {
    item.top -= item.height / 2;
    item.left -= item.height / 2;
  });

  // 再布局节点内部的节点
  let groupObj = {};
  innerNodes.forEach((item) => {
    if (!groupObj[item.group]) {
      groupObj[item.group] = [];
    }
    groupObj[item.group].push(item);
  });

  const ROW_CNT = extraOpts.rowCnt || 5;
  for(let key in groupObj) {
    let _groups = groupObj[key];
    let _groupsInfo = {};
    for(let i = 0; i < _groups.length; i++) {
      let row = parseInt(i / ROW_CNT);
      let col = i % ROW_CNT;
      if (!_groupsInfo[row]) {
        _groupsInfo[row] = {w: 0, h: 0};
      }
      let _nodeW = _groups[i].width || DEFUALT_NODE_WIDTH;
      let _nodeH = _groups[i].height || DEFUALT_NODE_HEIGHT;
      if (_nodeW > _groupsInfo[row].w) {
        _groupsInfo[row].w = _nodeW;
      }
      if (_nodeH > _groupsInfo[row].h) {
        _groupsInfo[row].h = _nodeH;
      }
    }

    _groupsInfo = Object.keys(_groupsInfo).sort().map((key) => _groupsInfo[key]);

    for(let i = 0; i < _groups.length; i++) {
      let row = parseInt(i / ROW_CNT);
      let col = i % ROW_CNT;

      let _top = 0;
      for(let j = 0; j <= row; j++) {
        _top += _groupsInfo[j].h;
      }
      _groups[i].top = _top + row * DEFAULT_GROUP_NODE_H_INTERVAL;
      _groups[i].left = col * _groupsInfo[row].w + col * DEFAULT_GROUP_NODE_W_INTERVAL;
    }
  }
  // 加group的padding
  innerNodes.forEach((item) => {
    item.top += 50;
    item.left += 10;
  });

  return {
    nodes,
    groups,
    edges
  }

};

export default layout;