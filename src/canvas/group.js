import {Group} from 'butterfly-dag';
import $ from 'jquery';
import _ from 'lodash';
import * as ReactDOM from 'react-dom';
import React from 'react';
import RightMenuGen from './right-menu';

const renderPagenation = (data) => {
  const {current, total, pageSize, isSearch, filterValue, pageCount} = data.options;
  return <div>
  {isSearch ? <input placeholder="请输入" className="group-search-input" value={filterValue} id={data.id} /> : null}  
  <div className="group-pagination-wrap">
    <i className="monitor-icon monitor-icon-left-circle group-pagination-wrap-prev"></i>
    <span className="group-pagination-wrap-pager" >{current}/{pageCount}</span>
    <i className="monitor-icon monitor-icon-right-circle group-pagination-wrap-next"></i>
  </div>
</div>
}

class BaseGroup extends Group {
  draw(obj) {
    let _dom = obj.dom;
    if (!_dom) {
      _dom = $('<div></div>')
        .attr('class', 'group')
        .css('top', obj.top)
        .css('left', obj.left)
        .css('width', obj.width + 'px')
        .css('height', obj.height + 'px')
        .attr('id', obj.id);
    }
    
    let group = $(_dom);
    this._container = $('<div></div>')
    .attr('class', 'butterflie-circle-group');
    let _content = $('<div class="butterflie-circle-group-content"></div>');
    let pagenation = $(`<div class="butterflie-circle-group-content-pagenation"></div>`)
    
    group.append(_content)
    // 添加文字
    if (_.get(obj, 'options.title')) {
      _content.append(`<span class="butterflie-circle-group-text">${obj.options.title}</span>`);
    }
    if(obj.options.pageSize) {
      _content.append(pagenation);
      ReactDOM.render(
        renderPagenation(this),
        pagenation[0]
      );
      pagenation.find('.group-pagination-wrap-prev').on('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        obj.options.current = obj.options.current === 1 ? 1 : obj.options.current - 1
        this.emit('custom.group.pagenationClick', {
          groups: obj
        });
      });
      pagenation.find('.group-pagination-wrap-next').on('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        obj.options.current = obj.options.current === obj.options.pageCount ? obj.options.pageCount : obj.options.current + 1
        this.emit('custom.group.pagenationClick', {
          groups: obj
        });
      });

      pagenation.find(`input[id=${this.id}]`).on('click',(e) => {
        e.preventDefault();
        e.stopPropagation();
        $(`input[id=${this.id}]`).focus();
      })
     pagenation.find(`input[id=${this.id}]`).on('input',(e) => {
        e.preventDefault();
        e.stopPropagation();
        $(`input[id=${this.id}]`).val();
        obj.options.filterValue = $(`input[id=${this.id}]`).val();
      })
      pagenation.find(`input[id=${this.id}]`).on('blur',(e) => {
        e.preventDefault();
        e.stopPropagation();
        obj.options.current = 1;
        this.emit('custom.group.pagenationClick', {
          groups: obj
        });
      })
   }

    group.append(this._container);

    

    return _dom;
  }

  mounted() {
    // 生成右键菜单
    this._createRightMenu();
  }

   // 生成右键菜单
   _createRightMenu() {
     let menus = _.get(this, 'options._menu', []);
    if (menus.length > 0) {
      $(this.dom).contextmenu((e) => {
        e.preventDefault();
        e.stopPropagation();
        RightMenuGen(this.dom, 'groups', [e.clientX, e.clientY], menus, this.options);
        this.emit('custom.groups.rightClick', {
          groups: this
        });
      })
    }
  }
}
export default BaseGroup;
