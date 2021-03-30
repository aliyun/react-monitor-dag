'use strict';

import { Node } from 'butterfly-dag';
import $ from 'jquery';
import Endpoint from './endpoint';
import * as _ from 'lodash';
import * as ReactDOM from 'react-dom';
import RightMenuGen from './right-menu';
import { Tips } from 'butterfly-dag';

export default class ScheduleNode extends Node {
  constructor(opts) {
    super(opts);
    // 当状态命中后会加上对应的类名
    this.statusCfg = {
      success: 'success',
      fail: 'fail',
      timeout: 'timeout',
      running: 'running',
      waiting: 'waiting',
    }
    this.status = undefined;
    this.statusDom = undefined;
  }
  draw(obj) {
    let _dom = obj.dom;
    if (!_dom) {
      _dom = $('<div></div>')
        .attr('class', 'node schedule-node')
        .attr('id', obj.name);
    }
    const node = $(_dom);
    // 计算节点坐标
    if (obj.top !== undefined) {
      node.css('top', `${obj.top}px`);
    }
    if (obj.left !== undefined) {
      node.css('left', `${obj.left}px`);
    }
    let direction = _.get(this, 'options._config.direction', 'top-bottom');
    if (direction === 'left-right') {
      let leftPoint = $('<div class="point left-point"></div>');
      let rightPoint = $('<div class="point right-point"></div>');
      node.append(leftPoint).append(rightPoint);
    } else {
      let topPoint = $('<div class="point top-point"></div>');
      let bottomPoint = $('<div class="point bottom-point"></div>');
      node.append(topPoint).append(bottomPoint);
    }
    if (_.get(this, 'options._config.nodeRender')) {
      this._createCustomDom(node);
    } else {
      this._createStatusPoint(node);
      this._createTitle(node);
    }
    this.updateStatusPoint(node);
    return node[0];
  }

  mounted() {
    // 生成锚点
    this._createNodeEndpoint();
    // 生成右键菜单
    this._createRightMenu();
    // 生成提示
    this._createTips();
    // 绑定双击事件
    $(this.dom).on('dblclick', (e) => {
      this.emit('custom.node.dblClick', {
        node: this
      });
    });
  }

  focus() {
    $(this.dom).addClass('focus');
    this.options.minimapActive = true;
  }

  unfocus() {
    $(this.dom).removeClass('focus');
    this.options.minimapActive = false;
  }
  updateStatusPoint(container = this.dom) {
    let newStatus = _.get(this.statusCfg, this.options.status);
    let oldStatus = _.get(this.statusCfg, this.status);
    if (newStatus && newStatus !== oldStatus) {
      if (oldStatus) {
        $(container).removeClass(oldStatus)
      }
      $(container).addClass(newStatus);
      this.status = newStatus;
    }
  }
  _createStatusPoint(container = this.dom) {
    this.statusCfg = _.get(this, 'options._registerStatus', this.statusCfg);
    this.statusDom = $('<span class="status"></span>');
    $(container).append(this.statusDom);
  }
  _createTitle(container = this.dom) {
    let title = _.get(this, 'options.title');
    if (title) {
      let titleDom = $(`<span class="title">${title}</span>`);
      $(container).append(titleDom);
    }
  }
  _createCustomDom(container = this.dom) {
    let nodeRender = _.get(this, 'options._config.nodeRender');
    ReactDOM.render(
      nodeRender(this.options),
      container[0]
    );
  }
  // 生成锚点
  _createNodeEndpoint() {
    let direction = _.get(this, 'options._config.direction', 'top-bottom');
    if (direction === 'left-right') {
      this.addEndpoint({
        // id: this.id + '-input',
        originId: this.id,
        id: this.id,
        orientation: [-1,0],
        type: 'target',
        dom: $(this.dom).find('.left-point')[0],
        _config: _.get(this, 'options._config'),
        Class: Endpoint
      });
      this.addEndpoint({
        // id: this.id + '-output',
        id: this.id,
        originId: this.id,
        orientation: [1,0],
        type: 'source',
        dom: $(this.dom).find('.right-point')[0],
        _config: _.get(this, 'options._config'),
        Class: Endpoint
      });
    } else {
      this.addEndpoint({
        // id: this.id + '-input',
        id: this.id,
        originId: this.id,
        orientation: [0,-1],
        type: 'target',
        dom: $(this.dom).find('.top-point')[0],
        _config: _.get(this, 'options._config'),
        Class: Endpoint
      });
      this.addEndpoint({
        // id: this.id + '-output',
        id: this.id,
        originId: this.id,
        orientation: [0,1],
        type: 'source',
        dom: $(this.dom).find('.bottom-point')[0],
        _config: _.get(this, 'options._config'),
        Class: Endpoint
      });
    }
  }
  // 生成右键菜单
  _createRightMenu() {
    let menus = _.get(this, 'options._menu', []);
    if (menus.length > 0) {
      $(this.dom).contextmenu((e) => {
        e.preventDefault();
        e.stopPropagation();
        RightMenuGen(this.dom, 'node', [e.clientX, e.clientY], menus, this.options);
        this.emit('custom.node.rightClick', {
          node: this
        });
      })
    }
  }
  // 生成提示
  _createTips() {
    let nodeTipsRender = _.get(this, 'options._config.nodeTipsRender');
    if (nodeTipsRender) {
      let tipsDom = $('<div class="tips-content"></div>');
      ReactDOM.render(
        nodeTipsRender(this.options),
        tipsDom[0]
      );
      Tips.createTip({
        placement: 'right',
        targetDom: this.dom,
        genTipDom: () => {
          return tipsDom[0];
        }
      });
    }
  }
};