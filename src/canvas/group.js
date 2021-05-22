import {Group} from 'butterfly-dag';
import $ from 'jquery';
import _ from 'lodash';
import RightMenuGen from './right-menu';

// const renderPagenation = (data) => {
//   const {currentPage, total, pageSize, isSearch, filterValue, pageCount} = data.options;
//   return <div className="group-pagination">
//   {isSearch ? <input placeholder="请输入" className="group-search-input" value={filterValue} id={data.id} /> : null}  
//   <div className="group-pagination-wrap">
//     <i className="monitor-icon monitor-icon-left-circle group-pagination-wrap-prev"></i>
//     <span className="group-pagination-wrap-pager" >{currentPage}/{pageCount}</span>
//     <i className="monitor-icon monitor-icon-right-circle group-pagination-wrap-next"></i>
//   </div>
// </div>
// }

class BaseGroup extends Group {
  constructor(opts) {
    super(opts);
    this._enableSearch = opts.enableSearch;
  }
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
    .attr('class', 'butterflie-group');
    let titleContainer = $('<div class="butterflie-group-title-content"></div>');
    
    group.append(titleContainer)
    // 添加文字
    if (_.get(obj, 'options.title')) {
      titleContainer.append(`<span class="butterflie-group-title-text">${obj.options.title}</span>`);
    }

    // 添加搜索
    if (this._enableSearch)  {
      this._createSearch(titleContainer);
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

  _createSearch (container = []) {
    let searchDom = [
      `<input placeholder="请输入" class="group-search-input" />`
    ].join('');
    searchDom = $(searchDom);
    $(container).append(searchDom);

    searchDom.on('click',(e) => {
      e.preventDefault();
      e.stopPropagation();
      $(e.target).focus();
    });

    searchDom.on('keydown',(e) => {
      if(e.keyCode === 13) {
        this._searchNodes($(e.target).val());
      }
    })
  }
  _searchNodes(text) {
    let focusNodes = this.nodes.filter((item) => {
      return _.get(item, 'options.title', '').indexOf(text) !== -1;
    });
    this.emit('custom.group.search', {
      nodes: focusNodes
    })
  }
}
export default BaseGroup;
