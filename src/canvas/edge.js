'use strict';

import {Edge} from 'butterfly-dag';
import $ from 'jquery';
import _ from 'lodash';
import * as ReactDOM from 'react-dom';
import { Tips } from 'butterfly-dag';
import RightMenuGen from './right-menu';

export default class BaseEdge extends Edge {
  mounted() {
    this._createRightMenu();
    this._createTips();
    if (_.get(this, 'options.flow')) {
      this.addAnimate({
        color: '#4b96ef'
      });
    }
  }
  draw(obj) {
    let path = super.draw(obj);
    path.setAttribute('class', 'butterflies-link monitor-dag-link');
    return path;
  }
  drawArrow(arrow) {
    let path = super.drawArrow(arrow);
    if (path) {
      path.setAttribute('class', 'butterflies-arrow monitor-dag-arrow');
    }
    return path;
  }
  focus() {
    $(this.dom).addClass('focus');
    $(this.arrowDom).addClass('focus');
    $(this.labelDom).addClass('focus');
  }
  unfocus() {
    $(this.dom).removeClass('focus');
    $(this.arrowDom).removeClass('focus');
    $(this.labelDom).removeClass('focus');
  }
  drawLabel(label) {
    if (label) {
      let labelRender = _.get(this, 'options._config.labelRender');
      let container = $('<span class="butterflies-label monitor-dag-label"></span>');
      container.on('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.emit('custom.edge.labelClick', {
          edge: this,
          label: label
        });
      });
      if (labelRender) {
        ReactDOM.render(
          labelRender(label, this.options),
          container[0]
        );
        return container[0];
      } else if (label) {
        container.text(label);
        return container[0];
      }
    }
  }
  // 右键菜单
  _createRightMenu() {
    let menus = _.get(this, 'options._menu', []);
    if (menus.length > 0) {
      $(this.eventHandlerDom).contextmenu((e) => {
        e.preventDefault();
        e.stopPropagation();
        RightMenuGen(this.dom, 'edge', [e.clientX, e.clientY], menus, this.options);
        this.emit('custom.edge.rightClick', {
          edge: this
        });
      })
    }
  }
  // 生成提示
  _createTips() {
    let labelTipsRender = _.get(this, 'options._config.labelTipsRender');
    if (labelTipsRender && this.labelDom) {
      let tipsDom = $('<div class="tips-content"></div>');
      ReactDOM.render(
        labelTipsRender(this.options.label, this.options),
        tipsDom[0]
      );
      Tips.createTip({
        placement: 'right',
        targetDom: this.labelDom,
        genTipDom: () => {
          return tipsDom[0];
        }
      });
    }
  }
}

