import {Group} from 'butterfly-dag';
import $ from 'jquery';
import _ from 'lodash';
import * as ReactDOM from 'react-dom';
import React from 'react';
import RightMenuGen from './right-menu';
import {Layout, Pagination, Input} from 'antd';
const { Search } = Input;
const getSearchValueFn = (value) => {
  console.log(value,'ssssss');
  this.emit('custom.group.searchValue', {
    value
  });
}

const renderPagenation = (data) => {
  const {current, total, pageSize, isSearch} = data;
  return <React.Fragment>
  {isSearch ? <Search placeholder="请输入" style={{ width: 100 }} size="small" /> : null}  
  <Pagination
    simple
    current={current}
    total={total} 
    pageSize={pageSize}
  />
</React.Fragment>
}

class BaseGroup extends Group {
  draw(obj) {
    let _dom = obj.dom;
    let paginationRender = _.get(this, '_global.config.paginationRender');
    let searchRender = _.get(this, '_global.config.searchRender');
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
    let pagenation = $('<div class="butterflie-circle-group-content-pagenation"></div>')
    
    group.append(_content)
    // 添加文字
    if (_.get(obj, 'options.title')) {
      _content.append(`<span class="butterflie-circle-group-text">${obj.options.title}</span>`);
    }
    if(obj.options.pageSize) {
      _content.append(pagenation);
      ReactDOM.render(
        renderPagenation(this.options),
        pagenation[0]
      );
      pagenation.find('.ant-pagination-prev').on('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.options.current = this.options.current === 1 ? 1 : this.options.current - 1
        this.emit('custom.group.pagenationClick', {
          groups: this
        });
      });
      pagenation.find('.ant-pagination-next').on('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.options.current = this.options.current === this.options.pageCount ? this.options.pageCount : this.options.current + 1
        this.emit('custom.group.pagenationClick', {
          groups: this
        });
      });

      pagenation.find('.ant-input').on('click',(e) => {
       e.preventDefault();
       e.stopPropagation();
       $('.ant-input').focus();
     })
      pagenation.find('.ant-input').on('blur',(e) => {
        e.preventDefault();
        e.stopPropagation();
        let value = $('.ant-input').val();
        getSearchValueFn(value);
      })
      pagenation.find('.ant-input-group-addon').on('click',(e) => {
        e.preventDefault();
        e.stopPropagation();
        let value = $('.ant-input').val();
        getSearchValueFn(value);
      })
      
      // pagenation.find('.ant-pagination-next').on('click', (e) => {
      //   e.preventDefault();
      //   e.stopPropagation();
      //   console.log(this, '333');
      //   this.options.current = this.options.current === this.options.pageCount ? this.options.pageCount : this.options.current + 1
      //   this.emit('custom.group.pagenationClick', {
      //     group: this
      //   });
      // });
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
  // drawArrow(isShow) {
  //   let dom = super.drawArrow(isShow);
  //   if (this.options.color) {
  //     $(dom).addClass(this.options.color);
  //   }
  //   return dom;
  // }
  // drawLabel(text) {
  //   // let dom = super.drawArrow(text);
  //   // console.log(dom);
  //   let dom = null;
  //   if (!!text) {
  //     dom = $(`<span class="label">${text}</span>`)[0];
  //   }
  //   return dom;
  // }
}
export default BaseGroup;
