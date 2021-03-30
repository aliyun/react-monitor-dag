import {Group} from 'butterfly-dag';
import $ from 'jquery';
import _ from 'lodash';
import * as ReactDOM from 'react-dom';
import React from 'react';

const getSearchValueFn = (value) => {
  console.log(value,'ssssss');
  this.emit('custom.group.searchValue', {
    value
  });
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
        .css('width', obj.width)
        .css('height', obj.height)
        .attr('id', obj.id);
    }
    
    let group = $(_dom);
    this._container = $('<div></div>')
    .attr('class', 'butterflie-circle-group');

    let _content = $('<div class="butterflie-circle-group-content"></div>');
    let pagenation = $('<div class="butterflie-circle-group-content-pagenation"></div>')
    let searchInput = $('<div class="butterflie-circle-group-content-searchInput"></div>')
    
    group.append(_content)
    
    // 添加文字
    if (_.get(obj, 'options.title')) {
      _content.append(`<span class="butterflie-circle-group-text">${obj.options.title}</span>`);
    }
    if(searchRender) {
      _content.append(searchInput);
      ReactDOM.render(
        searchRender(),
        searchInput[0]
      );
     searchInput.find('.ant-input').on('click',(e) => {
       e.preventDefault();
       e.stopPropagation();
       $('.ant-input').focus();
     })
      searchInput.find('.ant-input').on('blur',(e) => {
        e.preventDefault();
        e.stopPropagation();
        let value = $('.ant-input').val();
        getSearchValueFn(value);
      })
      searchInput.find('.ant-input-group-addon').on('click',(e) => {
        e.preventDefault();
        e.stopPropagation();
        let value = $('.ant-input').val();
        getSearchValueFn(value);
      })
    
   
   }
    if(paginationRender) {
      _content.append(pagenation);
      ReactDOM.render(
        paginationRender(this.options.current,this.options.total, this.options.pageSize),
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
