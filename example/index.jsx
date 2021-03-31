'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import {Layout, Pagination, Input} from 'antd';
import MonitorDag from '../index.tsx';
import mockData from './mock_data/data';

import 'antd/dist/antd.css';
import './index.less';

const {Header} = Layout;
const { Search } = Input;

const nodeMenu = [{
  key: 'detail',
  title: '节点信息',
  onClick: (key, data) => {
    console.log('click detail info')
  }
}, {
  key: 'run',
  render: (key, data) => {
    return <span>节点运行</span>
  },
  onClick: (key, data) => {
    console.log('run node');
  }
}]

const edgeMenu = [{
  key: 'detail',
  title: '线段信息',
  onClick: (key, data) => {
    console.log('click detail info',data)
  }
}, {
  key: '监控流程',
  render: (key, data) => {
    return <span>监控流程</span>
  },
  onClick: (key, data) => {
    console.log('monitor edge', data);
  }
}]

const groupMenu = [{
  key: 'detail',
  title: '节点组信息',
  onClick: (key, data) => {
    console.log('click detail info')
  }
}, {
  key: 'run',
  render: (key, data) => {
    return <span>节点运行</span>
  },
  onClick: (key, data) => {
    console.log('run node');
  }
}]

ReactDOM.render((
  <Router>
    <Layout>
      <Header className='header'>DTDesign-React运维/监控图</Header>
      <Layout>
        <MonitorDag
          data={mockData}
          nodeMenu={nodeMenu}
          edgeMenu={edgeMenu}
          groupMenu={groupMenu}
          config={{
            // direction: 'left-right',
            labelRender: (label, info) => {
              return label;
            },
            labelTipsRender: (label, info) => {
              return `${label}: 自定义label tips`;
            },
            // nodeRender: (nodeOpts) => {
            //   return (
            //     <span className="node-text">{nodeOpts.title}</span>
            //   )
            // },
            nodeTipsRender: (nodeOpts) => {
              return <span>{nodeOpts.title}: 自定义节点tips</span>
            },
            endpointTipsRender: (pointOpts) => {
              return <span>自定义锚点tips</span>
            },
            // paginationRender: true, 
            minimap: {
              enable: true,
              config: {
                nodeColor: 'rgba(216, 216, 216, 0.13)',
                activeNodeColor: '#F66902',
                viewportStyle: {
                  'background-color': 'rgba(216, 216, 216, 0.07)'
                },
                groups: mockData.groups,
                nodes: mockData.nodes
              }
            },
          }}
          onChangePage={(data) => {
             mockData.groups[0].options = data.options
          }}
        />
      </Layout>
    </Layout>
  </Router>
), document.getElementById('main'));
