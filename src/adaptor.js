'use strict';

import ScheduleNode from './canvas/node';
import Edge from './canvas/edge';
import Group from './canvas/group';
import * as _ from 'lodash';

const nodePositionFn = (data, pageData) => {
  let row = Math.floor(data.width / 125 );
  let cow = Math.floor(data.height / 40 );
  return pageData.map((item,index) => {
    if(index < row) {
      item.top = 55
      item.left = 125 * (index) + 12
    }
    for(let i = 2; i <= cow; i++) {
      if(index >= (i - 1) * row && index < i * row ) {
        item.top = 55 * i
        item.left = 125 * (index - (i - 1) * row) + 12
      }
    }
    return item
  })
};

export let transformInitData = (info) => {
  let {data, config, nodeMenu, edgeMenu,groupMenu, registerStatus} = info;
  let _nodes = data.nodes.filter(item => !item.group);
  let pageData = null;
  if(data.groups && data.groups.length > 0) {
    data.groups.map(item => {
      let _current;
      let {pageSize, current, filterValue=''} = item.options;
      const groupNodes = data.nodes.filter(nodeItem => {
        return nodeItem.group === item.id && nodeItem.title.includes(filterValue)
      });
        if (current){
          _current = (current - 1) * pageSize
        }
        let _total = groupNodes.length || 1;
        let pageCount = Math.ceil(_total / pageSize);
        // 当点击2的时候如果第二页是最后一页进入else全部展示
        if (_total > current + pageSize) {
          pageData = groupNodes.slice(_current, _current + pageSize);
        } else {
          pageData = groupNodes.slice(_current, groupNodes.length);
        }
        pageData = nodePositionFn(item, pageData); // 计算位置
        _nodes.push(...pageData);
        item.options = {
          ...item.options,
          title: '共' + groupNodes.length + '个节点',
          total: _total,
          pageSize,
          current,
          pageCount
        }
      return item;
    })
  } else {
    _nodes = data.nodes
  }
  
  let nodes = (_nodes || []).map((item) => {
    return _.assign(item, {
      _config: config,
      _menu: nodeMenu,
      _registerStatus: registerStatus,
      Class: ScheduleNode
    });
  });
  let edges = (data.edges || []).map((item) => {
    return _.assign(item, {
      id: `${item.source}-${item.target}`,
      type: 'endpoint',
      sourceNode: item.sourceNode,
      targetNode: item.targetNode,
      source: `${item.source}`,
      target: `${item.target}`,
      _config: config,
      _menu: edgeMenu,
      Class: Edge
    });
  });
  let groups = (data.groups || []).map((item) => {
    return _.assign(item, {
      options: {
        ...item.options,
        _menu: groupMenu,
      },
      Class: Group,
    });
  })
  return {
    nodes,
    edges,
    groups
  }
}

export let diffPropsData = (newData, oldData) => {
  let addNodes = _.differenceWith(newData.nodes, oldData.nodes, (a, b) => {
    return a.id === b.id;
  });
  let rmNodes = _.differenceWith(oldData.nodes, newData.nodes, (a, b) => {
    return a.id === b.id;
  });
  let addEdges = _.differenceWith(newData.edges, oldData.edges, (a, b) => {
    return (
      a.sourceNode === b.sourceNode &&
      a.targetNode === b.targetNode &&
      a.sourceEndpoint === b.sourceEndpoint &&
      a.targetEndpoint === b.targetEndpoint
    );
  });
  let rmEdges = _.differenceWith(oldData.edges, newData.edges, (a, b) => {
    return (
      a.sourceNode === b.sourceNode &&
      a.targetNode === b.targetNode &&
      a.sourceEndpoint === b.sourceEndpoint &&
      a.targetEndpoint === b.targetEndpoint
    );
  });
  let updateStatus = [];
  newData.forEach((_newNode) => {
    let oldNode = _.find(oldData, (_oldNode) => {
      return _newNode.id === _oldNode.id;
    });
    if (oldNode && oldNode.status !== _newNode.status) {
      updateStatus.push({
        status: _newNode.status,
        node: oldNode
      });
    }
  });

  return {
    addNodes,
    rmNodes,
    addEdges,
    rmEdges,
    updateStatus
  };
}