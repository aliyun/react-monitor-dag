'use strict';

import ScheduleNode from './canvas/node';
import Edge from './canvas/edge';
import * as _ from 'lodash';

export let transformInitData = (info) => {
  let {data, config, nodeMenu, edgeMenu, registerStatus} = info;
  let nodes = (data.nodes || []).map((item) => {
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
      sourceNode: item.source,
      targetNode: item.target,
      source: `${item.source}-output`,
      target: `${item.target}-input`,
      _config: config,
      _menu: edgeMenu,
      Class: Edge
    });
  })

  return {
    nodes,
    edges
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