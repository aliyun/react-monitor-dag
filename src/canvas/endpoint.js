'use strict';

import { Endpoint, Tips } from 'butterfly-dag';
import * as ReactDOM from 'react-dom';
import $ from 'jquery';

class NewEndPoint extends Endpoint {
  constructor(opts) {
    super(opts);
  }
  mounted() {
    // 生成提示
    this._createTips();
  }
  _createTips() {
    let pointTipsRender = _.get(this, 'options._config.endpointTipsRender');
    if (pointTipsRender) {
      let placement = '';
      let direction = _.get(this, 'options._config.direction');
      if (direction === 'left-right') {
        placement = this.type === 'target' ? 'left' : 'right';
      } else {
        placement = this.type === 'target' ? 'top' : 'bottom';
      }

      let tipsDom = $('<div class="tips-content"></div>');
      ReactDOM.render(
        pointTipsRender(this.options),
        tipsDom[0]
      );
      Tips.createTip({
        placement: placement,
        targetDom: this.dom,
        genTipDom: () => {
          return tipsDom[0];
        }
      });
    }
  }
}

export default NewEndPoint;
