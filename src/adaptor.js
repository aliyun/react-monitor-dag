'use strict';

import ScheduleNode from './canvas/node';
import Edge from './canvas/edge';
import Group from './canvas/group';
import * as _ from 'lodash';

// const nodePositionFn = (data, pageData) => {
//   let row = Math.floor(data.width / 125 );
//   let cow = Math.floor(data.height / 40 );
//   return pageData.map((item,index) => {
//     if(index < row) {
//       item.top = 55
//       item.left = 125 * (index) + 12
//     }
//     for(let i = 2; i <= cow; i++) {
//       if(index >= (i - 1) * row && index < i * row ) {
//         item.top = 55 * i
//         item.left = 125 * (index - (i - 1) * row) + 12
//       }
//     }
//     return item
//   })
// };


export let transformInitData = (info) => {
  let {
    data, config, nodeMenu,
    edgeMenu,groupMenu, registerStatus,
    nodeMenuClassName, groupCfg = {}
  } = info;
  
  let nodes = (data.nodes || []).map((item) => {
    return _.assign(item, {
      _config: config,
      _menu: nodeMenu,
      _registerStatus: registerStatus,
      _nodeMenuClassName: nodeMenuClassName,
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
      enableSearch: _.get(config, 'group.enableSearch', false),
      Class: Group,
    });
  });


  // group的分页处理
  let _groupEnablePagination = groupCfg.enablePagination;
  let _groupPageSize = groupCfg.pageSize || 20;
  if (_groupEnablePagination && groups && groups.length > 0) {

    let _groupsObj = {};
    let _groupHiddenNodes = {};

    for(let i = 0; i < groups.length; i++) {
      let _group = groups[i];
      if (!_groupsObj[_group.id]) {
        _groupsObj[_group.id] = [];
      }
    }
    for(let i = 0; i < nodes.length; i++) {
      let _node = nodes[i];
      if (_node.group) {
        _groupsObj[_node.group].push(_node);
      }
    }

    groups.forEach((item) => {
      let _nodes = _groupsObj[item.id];
      item._enablePagination = _groupEnablePagination;
      item._allNodeList = item._showNodeList = _nodes;
      item._pageSize = _groupPageSize;
      item._pageNum = 1;
      item._totalNum = _nodes.length;
    });

    let _rmNodes = [];
    for(let key in _groupsObj) {
      let _group = _groupsObj[key];
      _rmNodes = _rmNodes.concat(_group.slice(_groupPageSize, _group.length));
    }
    
    nodes = nodes.filter((item) => {
      let isRmNode = _.some(_rmNodes, (node) => node.id === item.id);
      if (isRmNode) {
        _groupHiddenNodes[item.id] = item;
      }
      return !isRmNode;
    });
  }

  return {
    nodes,
    edges,
    groups
  }
}

export let diffPropsData = (newData, oldData, diffOptions = []) => {
  let updateNodes = [];
  let addNodes = _.differenceWith(newData.nodes, oldData.nodes, (a, b) => {
    return a.id === b.id;
  });
  let rmNodes = _.differenceWith(oldData.nodes, newData.nodes, (a, b) => {
    return a.id === b.id;
  });
  let addGroups = _.differenceWith(newData.groups, oldData.groups, (a, b) => {
    return a.id === b.id;
  });
  let rmGroups = _.differenceWith(oldData.groups, newData.groups, (a, b) => {
    return a.id === b.id;
  });

  if (diffOptions.length > 0) {
    updateNodes = _.differenceWith(newData.nodes, oldData.nodes, (a, b) => {
      return diffOptions.reduce((pre, cur) => {
        return pre && a[cur] === b[cur];
      }, a[diffOptions[0]] === b[diffOptions[0]]);
    })
  }
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
  newData.nodes.forEach((_newNode) => {
    let oldNode = _.find(oldData.nodes, (_oldNode) => {
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
    addGroups,
    rmGroups,
    addNodes,
    rmNodes,
    updateNodes,
    addEdges,
    rmEdges,
    updateStatus
  };
}
