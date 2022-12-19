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
    this._titleContainer = null;
    this._enableSearch = opts.enableSearch;
    this._enablePagination = opts._enablePagination;
    this._pageSize = opts._pageSize;
    this._pageNum = opts._pageNum;
    this._totolNum = opts._totolNum;
    this._showNodeList = opts._showNodeList;
    this._allNodeList = opts._allNodeList;
    this._searchNodesList = [];
    this._keyword = '';
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

    // 添加分页
    if(this._enablePagination) {
      this._createPagination(titleContainer);
    }

    group.append(this._container);

    this._titleContainer = titleContainer;

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

  // 生成搜索
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

    let result = [];
    if (!!text) {
      if (this._onSearchGroup) {
        result = this._onSearchGroup(text, this._allNodeList);
      } else {
        result = this._allNodeList.filter((item) => {
          return (item.title || '').indexOf(text) !== -1;
        });
      }
    } else {
      result = this._allNodeList;
    }

    this._searchNodesList = result;
    this._keyword = text;
    this._pageNum = 1;
    this._totolNum = this._searchNodesList.length;
    this._showNodeList = this._searchNodesList.slice((this._pageNum - 1) * this._pageSize, this._pageNum * this._pageSize);
    this.emit('custom.groups.changePage', {
      group: this
    });
    // let resultNode = this.nodes.filter((item) => {
    //   console.log(item);
    //   return _.get(item, 'options.title', '').indexOf(text) !== -1;
    // });
    // this.emit('custom.group.search', {
    //   nodes: focusNodes
    // })
  }

  _createPagination(container = this._titleContainer) {
    let paginationDom = [
      '<div class="pagination-con">',
        '<span class="pre-page"><</span>',
        `<span class="total-num"></span>`,
        '<span class="next-page">></span>',
      '</div>'
    ].join('');

    paginationDom = $(paginationDom);
    $(container).append(paginationDom);

    paginationDom.find('.pre-page').on('click', () => {
      if (this._pageNum === 1) {
        return;
      }
      this._pageNum --;
      let _allNodeList = !!this._keyword ? this._searchNodesList : this._allNodeList;
      this._showNodeList = _allNodeList.slice((this._pageNum - 1) * this._pageSize, this._pageNum * this._pageSize);

      this.emit('custom.groups.changePage', {
        group: this
      });

    });

    paginationDom.find('.next-page').on('click', () => {
      let _allNodeList = !!this._keyword ? this._searchNodesList : this._allNodeList;
      let _lastPage = parseInt(_allNodeList.length / this._pageSize);
      if (_allNodeList.length % this._pageSize !== 0) {
        _lastPage ++;
      }

      if (this._pageNum === _lastPage) {
        return;
      }
      this._pageNum ++;
      this._showNodeList = _allNodeList.slice((this._pageNum - 1) * this._pageSize, this._pageNum * this._pageSize);
      
      this.emit('custom.groups.changePage', {
        group: this
      });
    });

    this._updateTotalCnt(container);
  }

  _updateTotalCnt (container = this._titleContainer) {
    let dom = $(container).find('.total-num');
    let _allNodeList = !!this._keyword ? this._searchNodesList : this._allNodeList;
    let _cnt = parseInt(_allNodeList.length / this._pageSize);
    if (_allNodeList.length % this._pageSize !== 0) {
      _cnt ++;
    }
    dom.text(`${this._pageNum} / ${_cnt}`);
  }
}
export default BaseGroup;
