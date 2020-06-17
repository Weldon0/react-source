
import {
  TAG_ROOT,
  TAG_TEXT,
  TAG_HOST,
  ELEMENT_TEXT,
  PLACEMENT,
  UPDATE,
  DELETION,
  TAG_CLASS,
} from './constants.js';

import { UpdateQueue } from './UpdateQueue.js';

import {
  setProps,
} from './uitls.js'

/**
从根节点渲染和调度
两个阶段
    diff阶段(render阶段):对比新旧VDOM，进行增量更新或创建
    比较花费时间，需要对任务拆分，拆分纬度就是VDOM,这个阶段可以暂停
    成果是effect list 哪些更新，副作用列表
commit阶段：
    dom更新创建阶段，不可暂停，要一气呵成
 */
let nextUnitOfWork = null; // 下一个工作单元
let workInProgressRoot = null; // RootFiber应用的根
let currentRoot = null; // 渲染成功之后的当前根Root,界面上看到的Root
let deletions = []; // 删除的节点不放到effect list里面,单独记录并执行

export function scheduleRoot(rootFiber) {
  if (currentRoot && currentRoot.alternate) {
    workInProgressRoot = currentRoot.alternate;
    workInProgressRoot.alternate = currentRoot; // alternate更新

    if (rootFiber) {
      workInProgressRoot.props = rootFiber.props;
    }
  } else if (currentRoot) { // 至少渲染过一次
    if (rootFiber) {
      rootFiber.alternate = currentRoot;
      workInProgressRoot = rootFiber;
    } else {
      workInProgressRoot = {
        ...currentRoot,
        alternate: currentRoot,
      }
    }
  } else { // 如果是第一次渲染
    workInProgressRoot = rootFiber;
  }

  // 清空更新指针(防止出错)
  workInProgressRoot.firstEffect = workInProgressRoot.lastEffect = workInProgressRoot.nextEffect = null;
   // 不会变化

  nextUnitOfWork = workInProgressRoot; // 一直变化
}

function performUnitOfWork(currentFiber) {
  /**
   * 作用：
   *  1、为传入的Fiber创建stateNode，child链接第一个子节点。
   *  2、为自己的一级子节点创建Fiber，并sibling链接，不会创建stateNode。
   *  3、一级子节点的return指向父节点
   *  4、所有一级子节点Fiber创建完，就会结束，判断当前帧是否还有执行时间，进入下一个执行单元
   */
  beginWork(currentFiber); // 开始处理工作
  if (currentFiber.child) {
    return currentFiber.child; // root的child是A1
  }

  while (currentFiber) {
    completeUintOfWork(currentFiber); // 没有child让自己完成
    if (currentFiber.sibling) {
      return currentFiber.sibling;
    }

    currentFiber = currentFiber.return; // 找到return， 让return完成
  }
}


// 收集副作用fiber，组成effect list
// 每个fiber有两个属性，firstEffectList指向第一个有副作用的子fiber,lasterEffect指向最后一个有更新的zifiber
// 中间的nextEffect做成一个单链表，firstEffect=大儿子.nextEffect=二儿子.nextEffect=三儿子
function completeUintOfWork(currentFiber) { // 第一个完成A1TEXT
  let returnFiber = currentFiber.return; // A1
  if (returnFiber) {

    // 自己儿子的effect链挂到父亲身上
    if (!returnFiber.firstEffect) {
      returnFiber.firstEffect = currentFiber.firstEffect;
    }
    if (currentFiber.lastEffect) {
      if (returnFiber.lastEffect) {
        returnFiber.lastEffect.nextEffect = currentFiber.firstEffect;
      }
      returnFiber.lastEffect = currentFiber.lastEffect;
    }

    // 自己挂到父亲身上
    const effectTag = currentFiber.effectTag;
    if (effectTag) { // 说明有副作用，第一个次是增加
    /**
        每一个fiber
        firstEffect:第一个副作用节点
        lastEffect: 最后一个副作用节点
        中间的通过nextEffect做成单链表
     */
      if (returnFiber.lastEffect) {
        returnFiber.lastEffect.nextEffect = currentFiber;
      } else {
        returnFiber.firstEffect = currentFiber;
      }
      returnFiber.lastEffect = currentFiber;
    }
  }
}

/**
 * 开始工作
 * completeUintOfWork 工作完成 (收集effect)
 * 1、创建真实DOM元素
 * 2、创建子Fiber
 */
function beginWork(currentFiber) {
  if (currentFiber.tag === TAG_ROOT) { // 根fiber
    updateHostRoot(currentFiber)
  } else if (currentFiber.tag === TAG_TEXT) {
    updateHostText(currentFiber);
  } else if (currentFiber.tag === TAG_HOST) { // 原生DOM
    updateHost(currentFiber);
  } else if (currentFiber.tag === TAG_CLASS) {
    updateClassComponent(currentFiber);
  }
}

function updateClassComponent(currentFiber) {
  if (!currentFiber.stateNode) { // 类组件的stateNode为组件实例
    // new Counter(); 类组件实例和fiber双向指向
    currentFiber.stateNode = new currentFiber.type(currentFiber.props);
    currentFiber.stateNode.internalFiber = currentFiber;
    currentFiber.stateNode.props = currentFiber.stateNode.internalFiber.props;

    currentFiber.updateQueue = new UpdateQueue();
  }
  // 组件实例state赋值
  currentFiber.stateNode.state = currentFiber.updateQueue.forcedUpdate(currentFiber.stateNode.state);

  let newElement = currentFiber.stateNode.render();

  const newChildren = [newElement];

  reconcileChildren(currentFiber, newChildren);
}

function updateHost(currentFiber) {
  if (!currentFiber.stateNode) { // 没有创建dom节点
    currentFiber.stateNode = createDOM(currentFiber);
  }

  const newChildren = currentFiber.props.children;
  reconcileChildren(currentFiber, newChildren);
}

function createDOM(currentFiber) {
  if (currentFiber.tag === TAG_TEXT) {
    return document.createTextNode(currentFiber.props.text);
  } else if (currentFiber.tag === TAG_HOST) {
    let stateNode = document.createElement(currentFiber.type);
    updateDOM(stateNode, {}, currentFiber.props);
    return stateNode;
  }
}

function updateDOM(stateNode, oldProps, newProps) {
  if (!stateNode.setAttribute) return;
  setProps(stateNode, oldProps, newProps);
}

// 文本节点
function updateHostText(currentFiber) {
  // 文本节点没有child不需要处理
  if (!currentFiber.stateNode) { // 没有创建dom节点
    currentFiber.stateNode = createDOM(currentFiber);
  }
}

function updateHostRoot(currentFiber) {

  // 先处理自己，如果原生节点，创建真实DOM  ==> 创建子fiber
  let newChildren = currentFiber.props.children; // element要渲染的元素
  reconcileChildren(currentFiber, newChildren);
}

/**
 * 如果是第一次创建hostRoot(.root的Fiber)
    1、为hostRoot链接child(A1);
    2、为A1创建Fiber(不会创建真实DOM节点),更新模式为新增

  如果是A1节点
    1、
 */
function reconcileChildren(currentFiber, newChildren) {
  let newChildIndex = 0; // 新子节点的索引
  let oldFiber = currentFiber.alternate && currentFiber.alternate.child;
  if (oldFiber) {
    oldFiber.fistEfficient = oldFiber.lastEffect = oldFiber.nextEffect = null;
  }

  let prevSibling; // 上一个新的子fiber
  while(newChildIndex < newChildren.length || oldFiber) {
    let tag;
    let newChild = newChildren[newChildIndex];
    let newFiber;


    // 判断是否可以复用
    // type类型
    const sameType = oldFiber && newChild && oldFiber.type === newChild.type;
    if (newChild && typeof newChild.type === 'function' && newChild.type.prototype.isReactComponent) {
      tag = TAG_CLASS;
    } else if (newChild.type === ELEMENT_TEXT) {
      tag = TAG_TEXT; // 文本节点
    } else if (typeof newChild.type === 'string') {
      tag = TAG_HOST; // 原生DOM节点
    }

    if (sameType) {
      if (oldFiber.alternate) { // 至少已经更新过一次,然后复用上上次fiber
        newFiber = oldFiber.alternate;
        newFiber.props = newChild.props;
        newFiber.alternate = oldFiber;
        newFiber.effectTag = UPDATE;
        newFiber.updateQueue = oldFiber.updateQueue || new UpdateQueue();
        newFiber.nextEffect = null;
      } else {
        newFiber = {
          tag: oldFiber.tag,
          type: oldFiber.type,
          props: newChild.props, // 必须用新的props
          stateNode: oldFiber.stateNode, // 复用老节点
          return: currentFiber, // 父fiber
          alternate: oldFiber, // 指针指向老节点
          updateQueue: oldFiber.updateQueue || new UpdateQueue(),
          effectTag: UPDATE, // 增加节点 副作用标识，render收集副作用(修改)
          nextEffect: null, // effect list 单链表  和完成顺序一样，但是节点会少，只放改动的节点
        }
      }
    } else {
      if (newChild) {
        newFiber = {
          tag,
          type: newChild.type, // div
          props: newChild.props,
          stateNode: null, // div还没有创建dom元素
          return: currentFiber, // 父fiber
          effectTag: PLACEMENT, // 增加节点 副作用标识，render收集副作用(修改)
          updateQueue: new UpdateQueue(),
          nextEffect: null, // effect list 单链表  和完成顺序一样，但是节点会少，只放改动的节点
        }
      }

      if (oldFiber) {
        oldFiber.effectTag = DELETION;
        deletions.push(oldFiber);
      }
    }

    // fiber指针向后移动一次，因为老的是fiber是fiber，新的是VDOM
    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (newFiber) {
      if (newChildIndex === 0) { // 第一个子元素
        currentFiber.child = newFiber;
      } else {
        // 第一次不会进来
        prevSibling.sibling = newFiber; // 第一个子元素sibling指向兄弟
      }
      prevSibling = newFiber;
    }
    newChildIndex++;
  }
}

// 循环执行工作 nextUnitOfWork
function workLoop(deadline) {
  let shouldYield = false; // 是否让出时间片(控制权)
  while (nextUnitOfWork && !shouldYield) {
    debugger
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork); // root的下一个工作单元是第一个子节点A1
    shouldYield = deadline.timeRemaining() < 1; // ms 没有时间让出时间片
  }

  if (!nextUnitOfWork && workInProgressRoot) {
    console.log('render结束');
    commitRoot();
  }
  // 不管有没有任务，都继续调度，每一帧都要执行一次kug
  requestIdleCallback(workLoop, { timeout: 500 }); // 如果时间片到期还有任务没完成,继续调度
}

function commitRoot() {
  deletions.forEach(commitWork); // 执行effectList之前先把要删除的元素删除掉
  let currentFiber = workInProgressRoot.firstEffect;
  while (currentFiber) {
    commitWork(currentFiber);
    currentFiber = currentFiber.nextEffect;
  }
  deletions.length = 0; // 提交后清空deletions数组
  currentRoot = workInProgressRoot; // 渲染成功的根Fiber赋值给currentRoot;
  workInProgressRoot = null;
}

function commitWork(currentFiber) {
  if (!currentFiber) return;
  let returnFiber = currentFiber.return;
  while (returnFiber.tag !== TAG_HOST && returnFiber.tag !== TAG_ROOT && returnFiber.tag !== TAG_TEXT) {
    returnFiber = returnFiber.return;
  }
  let returnDOM = returnFiber.stateNode;
  if (currentFiber.effectTag === PLACEMENT) { // 新增节点
    let nextFiber = currentFiber;
    while (nextFiber.tag !== TAG_HOST && nextFiber.tag !== TAG_TEXT) {
      // 如果要挂载的节点不是DOM节点，比如类组件Fiber，一直找儿子，直到找到真实DOM为止
      nextFiber = currentFiber.child;
    }
    returnDOM.appendChild(nextFiber.stateNode)
  } else if (currentFiber.effectTag === DELETION) { // 删除节点
    // returnDOM.removeChild(currentFiber.stateNode)
    commitDeletion(currentFiber, returnDOM);
    return;
  } else if (currentFiber.effectTag === UPDATE) {
    if (currentFiber.type === ELEMENT_TEXT) { // 文本节点
      if (currentFiber.alternate.props.text !== currentFiber.props.text) {
        currentFiber.stateNode.textContent = currentFiber.props.text;
      } else {
        updateDOM(
          currentFiber.stateNode,
          currentFiber.alternate.props,
          currentFiber.props
        );
      }

    }
  }

  currentFiber.effectTag = null;
}

function commitDeletion(currentFiber, returnDOM) {
  if (currentFiber.tag === TAG_HOST && currentFiber.tag === TAG_TEXT) {
    returnDOM.removeChild(currentFiber.stateNode);
  } else {
    commitDeletion(currentFiber.children, returnDOM);
  }
}

// react ==> 浏览器：我有任务，请你空闲时间执行一下
// 优先级概念  expirationTime（暂时忽略）
requestIdleCallback(workLoop, { timeout: 500 });
