'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import {Layout, Pagination, Input} from 'antd';
import { AudioOutlined } from '@ant-design/icons';
import MonitorDag from '../index.tsx';
// import mockData from './mock_data/data';

import 'antd/dist/antd.css';
import './index.less';

const {Header} = Layout;
const { Search } = Input;

const mockData = {
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
      left: 300,
      group: 'group',
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
  ],
  groups: [{
    id: 'group',
    options: {
      title: '测试',
      content: 'ssss',
      current: 2,
      pageSize: 10,
      minimapActive: true
    },
    top: 330,
    left: 200,
    width: '500',
    height: '300',
    // resize: true,
    // size: 2,
    endpoints: [{
      id: 'left',
      orientation: [0, -1],
      pos: [0.5, 0],
    }]
  }],
};

ReactDOM.render((
  <Router>
    <Layout>
      <Header className='header'>DTDesign-React运维/监控图</Header>
      <Layout>
        <MonitorDag 
          data={mockData}
          nodeMenu={[{
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
          }]}
          edgeMenu={[{
            key: 'detail',
            title: '线段信息',
            onClick: (key, data) => {
              console.log('click detail info')
            }
          }, {
            key: '监控流程',
            render: (key, data) => {
              return <span>监控流程</span>
            },
            onClick: (key, data) => {
              console.log('monitor edge');
            }
          }]}
          config={{
            // direction: 'left-right',
            // current:1,
            labelRender: (label, info) => {
              // return <span onClick={() => {console.log('1111')}}>{label}</span>;
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
            paginationRender: (curr, total, pageSize) => {
              return  <Pagination 
                        simple 
                        current={curr} 
                        total={total} 
                        pageSize={pageSize} 
                        />;
            },
            searchRender: (value) => {
              return <Search placeholder="请输入" style={{ width: 100 }} size="small" />
            },
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
             console.log('sssssssss', data.options, mockData);
          }}
        />
      </Layout>
    </Layout>
  </Router>
), document.getElementById('main'));

// ReactDOM.render((
//   <Pagination simple defaultCurrent={2} total={50} />
// ), document.getElementById('content'));
