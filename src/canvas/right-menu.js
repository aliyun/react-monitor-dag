'use strict';
import $ from 'jquery';
import * as ReactDOM from 'react-dom';
import getType from '../utils/getType';

const Tips = require('butterfly-dag').Tips;

let _genTipDom = (menu, data) => {
  let dom = $('<div class="menu-container"></div>');
  let menuType = getType(menu);
  let menuData = menuType === 'function' ? menu(data) : menu;
  menuData.forEach((item) => {
    let menuItem = $('<div class="menu-item"></div>');
    if (item.onClick) {
      menuItem.on('click', (e) => {
        item.onClick(item.key, data);
      });
    }
    dom.append(menuItem);
    if (item.render) {
      ReactDOM.render(
        item.render(item.key, data),
        menuItem[0]
      );
    } else {
      menuItem.text(item.title || item.key);
    }
  });
  return dom[0]
}

export default (container, type, pos, menu, data, classname = '') => {
  Tips.createMenu({
    className: `butterfly-${type}-monitor-menu ${classname}`,
    targetDom: container,
    genTipDom: () => { return _genTipDom(menu, data) },
    placement: 'right',
    action: null,
    x: pos[0],
    y: pos[1],
    closable: true
  });
}
