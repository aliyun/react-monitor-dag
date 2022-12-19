'use strict';

import _ from 'lodash';

import { Layout } from 'butterfly-dag';

const layout = (data, options, extraOpts) => {
  let {nodes, groups, edges} = data;
  let layputOpts = {};

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
      item.width = 100;
    }
    if (!item.height) {
      item.height = 32;
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
    for(let i = 0; i < _groups.length; i++) {
      let row = parseInt(i / ROW_CNT);
      let col = i % ROW_CNT;
      _groups[i].top = row * 50;
      _groups[i].left = col * 160;
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