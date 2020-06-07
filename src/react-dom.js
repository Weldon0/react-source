
import {
  TAG_ROOT,
} from './constants.js'

import { scheduleRoot } from './schedule.js'


// 渲染元素到容器内部
function render(element, container) { // container = root节点
  // 为根节点(要挂载的dom)创建了fiber，直接传入
  let rootFiber = {
    tag: TAG_ROOT, // tag标识节点类型
    stateNode: container, // 如果元素为原生节点，指向真实DOM元素
    props: {
        // children数组，放的react元素，VDOM,后面根据react元素创建Fiber
      children: [element], // 要渲染的元素
    },
  }

  scheduleRoot(rootFiber);
}

const ReactDOM = {
  render,
}

// reconciler schedule 都是单独的包

export default ReactDOM;