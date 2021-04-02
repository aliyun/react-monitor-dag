// 'use strict';

// export default {
//   nodes: [{
//     id: 1,
//     top: 50,
//     left: 500,
//     title: '任务1',
//     status: 'success'
//   }, {
//     id: 2,
//     top: 150,
//     left: 500,
//     title: '任务2',
//     status: 'running'
//   }, {
//     id: 3,
//     top: 250,
//     left: 500,
//     title: '任务3',
//     status: 'waiting'
//   }, {
//     id: 4,
//     top: 350,
//     left: 500,
//     title: '任务4',
//     status: 'timeout'
//   }, {
//     id: 5,
//     top: 450,
//     left: 500,
//     title: '任务5',
//     status: 'fail'
//   }, {
//     id: 6,
//     top: 550,
//     left: 500,
//     title: '自定义',
//     status: 'other'
//   }],
//   edges: [{
//     source: 1,
//     target: 2
//   }, {
//     source: 2,
//     target: 3,
//     flow: true
//   }, {
//     source: 3,
//     target: 4
//   }, {
//     source: 4,
//     target: 5
//   }, {
//     source: 5,
//     target: 6,
//     label: 'test label'
//   }]
// }

export default {
  nodes: [
    {
      id: '1',
      title: '某某算法',
      className: 'icon-background-color',
      iconType: 'icon-kaifa',
      top: 50,
      left: 400,
      status: 'success',
      endpoints: [{
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '2',
      title: '某某算法',
      className: 'icon-background-color',
      iconType: 'icon-kaifa',
      top: 150,
      left: 400,
      status: 'running',
      endpoints: [{
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '3',
      title: '某某算法',
      className: 'icon-background-color',
      iconType: 'icon-kaifa',
      top: 250,
      left: 400,
      status: 'timeout',
      endpoints: [{
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '16',
      title: '某某算法11',
      className: 'icon-background-color',
      iconType: 'icon-kaifa',
      top: 55,
      left: 50,
      group: 'group',
      status: 'success',
      endpoints: [{
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '17',
      title: '某某算法22',
      className: 'icon-background-color',
      iconType: 'icon-kaifa',
      top: 55,
      left: 150,
      group: 'group',
      status: 'success',
      endpoints: [{
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '18',
      title: '某某算法33',
      className: 'icon-background-color',
      iconType: 'icon-kaifa',
      top: 55,
      left: 50,
      group: 'group',
      status: 'success',
      endpoints: [{
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '4',
      title: '某某算法44',
      className: 'icon-background-color',
      iconType: 'icon-kaifa',
      top: 55,
      left: 50,
      group: 'group',
      status: 'success',
      endpoints: [{
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '5',
      title: '某某算法55',
      className: 'icon-background-color',
      iconType: 'icon-kaifa',
      top: 55,
      left: 50,
      group: 'group',
      status: 'success',
      endpoints: [{
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '6',
      title: '某某算法66',
      className: 'icon-background-color',
      iconType: 'icon-kaifa',
      top: 55,
      left: 50,
      group: 'group',
      status: 'success',
      endpoints: [{
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '7',
      title: '某某算法77',
      className: 'icon-background-color',
      iconType: 'icon-kaifa',
      top: 55,
      left: 50,
      group: 'group',
      status: 'success',
      endpoints: [{
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '8',
      title: '某某算法88',
      className: 'icon-background-color',
      iconType: 'icon-kaifa',
      top: 55,
      left: 50,
      group: 'group',
      status: 'success',
      endpoints: [{
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '9',
      title: '某某算法99',
      className: 'icon-background-color',
      iconType: 'icon-kaifa',
      top: 55,
      left: 50,
      group: 'group',
      status: 'success',
      endpoints: [{
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '10',
      title: '某某算法00',
      className: 'icon-background-color',
      iconType: 'icon-kaifa',
      top: 55,
      left: 50,
      group: 'group',
      status: 'success',
      endpoints: [{
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '11',
      title: '某某算法qq',
      className: 'icon-background-color',
      iconType: 'icon-kaifa',
      top: 70,
      left: 50,
      group: 'group',
      status: 'success',
      endpoints: [{
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '12',
      title: '某某算法ww',
      className: 'icon-background-color',
      iconType: 'icon-kaifa',
      top: 55,
      left: 50,
      group: 'group',
      status: 'success',
      endpoints: [{
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '13',
      title: '某某算法ee',
      className: 'icon-background-color',
      iconType: 'icon-kaifa',
      top: 55,
      left: 300,
      group: 'group',
      status: 'success',
      endpoints: [{
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '15',
      title: '交运算rr',
      className: 'icon-background-color',
      iconType: 'icon-guanlian',
      top: 205,
      left: 300,
      group: 'group',
      status: 'success',
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '122',
      title: '交运算tt',
      className: 'icon-background-color',
      iconType: 'icon-guanlian',
      top: 205,
      left: 400,
      group: 'group1',
      status: 'success',
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '123',
      title: '交运算tt1',
      className: 'icon-background-color',
      iconType: 'icon-guanlian',
      top: 205,
      left: 400,
      group: 'group1',
      status: 'success',
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '124',
      title: '交运算tt',
      className: 'icon-background-color',
      iconType: 'icon-guanlian',
      top: 205,
      left: 400,
      group: 'group1',
      status: 'success',
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '125',
      title: '交运算tt',
      className: 'icon-background-color',
      iconType: 'icon-guanlian',
      top: 205,
      left: 400,
      group: 'group1',
      status: 'success',
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '126',
      title: '交运算tt',
      className: 'icon-background-color',
      iconType: 'icon-guanlian',
      top: 205,
      left: 400,
      group: 'group1',
      status: 'success',
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
      }]
    },
  ],
  edges: [
    {
      source: '1',
      target: '2',
      sourceNode: '1',
      targetNode: '2',
      arrow: true,
      type: 'endpoint',
      arrowPosition: 0.5,
    },
    {
      source: '2',
      target: '3',
      sourceNode: '2',
      targetNode: '3',
      arrow: true,
      type: 'endpoint',
      arrowPosition: 0.5,
    },
    {
      source: 'bottom',
      target: 'left',
      sourceNode: '3',
      targetNode: 'group',
      arrow: true,
      type: 'endpoint',
      arrowPosition: 0.5,
    },
    {
      source: 'bottom',
      target: 'left',
      sourceNode: 'group',
      targetNode: 'group1',
      arrow: true,
      type: 'endpoint',
      arrowPosition: 0.5,
    },
  ],
  groups: [{
    id: 'group1',
    options: {
      title: '测试',
      current: 1,
      pageSize: 10,
      isSearch: true,
      filterValue: ''
    },
    top: 730,
    left: 200,
    width: 500,
    height: 300,
    resize: true,
    draggable: false,
    size: 2,
    endpoints: [{
      id: 'left',
      orientation: [0, -1],
      pos: [0.5, 0],
    }]
  },{
    id: 'group',
    options: {
      title: '测试',
      current: 1,
      pageSize: 10,
      isSearch: true,
      filterValue: '算法'
    },
    top: 330,
    left: 200,
    width: 500,
    height: 300,
    resize: true,
    draggable: false,
    size: 2,
    endpoints: [{
      id: 'left',
      orientation: [0, -1],
      pos: [0.5, 0],
    }]
  }],
};
