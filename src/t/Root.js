import {TAG_CLASS, TAG_HOST} from "../constants";

beginWork(rootFiber); // 构建根root，#root

// ====> 结果是

const currentFiber = {
  tag: TAG_HOST,
  stateNode: 'div#root',
  props: {
    children: ['Counter VDom'],
  },
  child: { // counter类组件Fiber
    tag: TAG_CLASS,
    return: currentFiber,
    props: {
      name: '计算器',
      id: 'test',
      children: [],
    },
    type: 'class Counter', // 类组件构造函数
    updateQueue: {
      firstUpdate: null,
      lastUpdate: null,
    },
  },
}
