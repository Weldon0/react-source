import {TAG_CLASS} from "../constants";

// 处理root时候fiber已经构建好，并做了return指针指向
// Counter类组件Fiber
let currentFiber = {
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
}

beginWork(currentFiber); // 处理Counter类组件

// updateClassComponent ====> (处理类组件stateNode，为组件实例)

currentFiber = {
  ...currentFiber,
  stateNode: { // 通过type实例化出类组件
    internalFiber: currentFiber, // stateNode-->internalFiber-->currentFiber
    onClick: () => {},
    props: { name: "计数器", id: "test", children: Array(0) },
    state: { number: 0 },
  },
  updateQueue: {
    lastUpdate: '',
    firstUpdate: '',
  },
}

// reconcileChildren ==> 结果

currentFiber = {
  ...currentFiber,
  child: { // div#counter
    tag: 'HOST',
    return: currentFiber, // 类组件Counter
    updateQueue: {
      lastUpdate: null,
      firstUpdate: null,
    }
  },
}



