'use strict';

export default {
  nodes: [{
    id: 1,
    top: 50,
    left: 500,
    title: '任务1',
    status: 'success'
  }, {
    id: 2,
    top: 150,
    left: 500,
    title: '任务2',
    status: 'running'
  }, {
    id: 3,
    top: 250,
    left: 500,
    title: '任务3',
    status: 'waiting'
  }, {
    id: 4,
    top: 350,
    left: 500,
    title: '任务4',
    status: 'timeout'
  }, {
    id: 5,
    top: 450,
    left: 500,
    title: '任务5',
    status: 'fail'
  }, {
    id: 6,
    top: 550,
    left: 500,
    title: '自定义',
    status: 'other'
  }],
  edges: [{
    source: 1,
    target: 2
  }, {
    source: 2,
    target: 3
  }, {
    source: 3,
    target: 4
  }, {
    source: 4,
    target: 5
  }, {
    source: 5,
    target: 6,
    label: 'test label'
  }]
}
