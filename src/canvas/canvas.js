'use strict';
import { Canvas, Layout } from 'butterfly-dag';

export default class MonitorCanvas extends Canvas {
  constructor(opts) {
    super(opts);
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
};