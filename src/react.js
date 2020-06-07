

import {
  ELEMENT_TEXT,
} from './constants.js'

import { Update } from './UpdateQueue.js';
import { scheduleRoot } from './schedule.js'

/*
* 创建元素虚拟DOM
* type: 元素类型， div,span p 
* config 配置对象 属性：ref,id
* children: 子元素，暂时数组
*/
function createElement(type, config, ...children) {
  delete config.__self;
  delete config.__source; // 表示元素在哪行那列哪个文件生成
  return {
    type,
    props: {
      ...config,
      children: children.map(child => {
        return typeof child === 'object' ? child : { // 对文本节点做了兼容处理
          // 如果child是react.createElelment返回的元素就不做转化，如果实字符串就坐转化
          // 源码是字符串 
          type: ELEMENT_TEXT,
          props: {
            text: child,
            children: [],
          }
        }
      }),
    },
  }
}


class Component {

  setState(payload) { // payload函数或者对象
    let update = new Update(payload);
    // updateQueue 其实放在此类组件对应的fiber节点上的 internalFiber;
    this.internalFiber.updateQueue.enqueueUpdate(update);
    scheduleRoot(); // 从根节点开始调度
  }
}

Component.prototype.isReactComponent = {}; // 类组件

const React = {
  createElement,
  Component,
}

export default React;