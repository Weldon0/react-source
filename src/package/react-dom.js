let isFirstRender = false;

const HOSTROOT = 'HOSTROOT'; // rootFiber
const CLASS_COMPONENT = 'CLASS_COMPONENT'; // 类组件
const HOSTCOMPONENT = 'HOSTCOMPONENT';
const HOSTTEXT = 'HOSTTEXT'; // 问本类型
const FUNCTION_COMPONENT = 'FUNCTION_COMPONENT'; // 函数类型

const NOWORK = 'NOWORK'; // 咩有任何工作
const PLACEMENT = 'PLACEMENT'; // 新增节点 effectTag
const UPDATE = 'UPDATE'; // 更新
const DELETION = 'DELETION'; // 删除
const PLACEMENTANDUPDATE = 'PLACEMENTANDUPDATE'; // 节点换位置同时属性更新

// 每次更新都是从root开始遍历

class FiberNode {
  // pendingProps 即将挂载的属性
  constructor(tag, key, pendingProps) {
    this.tag = tag; // 当前Fiber的类型 文本/组件/
    this.key = key;
    this.type = null; // div | span | class Component
    this.stateNode = null; // fiber的实例 class new完的结果
    this.child = null;
    this.sibling = null;
    this.return = null;

    this.index = 0;
    this.memoizedState = null; // 当前Fiber state
    this.memoizedProps = null; // 当前fiber的props
    this.pendingProps = null; // 新传进来的props

    this.effectTag = null; // 当前节点要进行何种更新

    this.firstEffect = null; // 当前子节点有更新的第一个
    this.lastEffect = null; // 当前子节点有更新的最后一个
    this.nextEffect = null; // 下一个更新的子节点

    this.alternate = null; // 链接current和workingprogress
    this.updateQueue = null; // 链表：当前fiber的新的状态

    // ...很多其他属性 
    // expirationTime: 0;
  }
}

function createFiber(tag, key, pendingProps) {
  return new FiberNode(tag, key, pendingProps);
}

function createWorkInProgress(current, pendingProps) {
  // 复用
  let workInProgress = current.alternate;
  // 初次渲染
  if (!workInProgress) {
    workInProgress = createFiber(current.tag, current.key, pendingProps);
    workInProgress.type = current.type;
    workInProgress.stateNode = current.stateNode;
    workInProgress.alternate = current;
    current.alternate = workInProgress;
  } else {
    workInProgress.pendingProps = pendingProps;
    workInProgress.effectTag = NOWORK;
    workInProgress.firstEffect = null;
    workInProgress.lastEffect = null;
    workInProgress.nextEffect = null;
  }

}

class ReactRoot {
  constructor(container) {
    this._internalFiber = this._createRoot(container);
  }

  _createRoot(container) {
    let uninitialFiber = this._createUninitialFiber(HOSTROOT, null, null);
    
    let root = {
      container: container,
      current: uninitialFiber,
      finishedWork: null, // 指向workInProgress
    }

    uninitialFiber.stateNode = root;
    return root;
  }

  _createUninitialFiber(tag, key, pendingProps) {
    return createFiber(tag, key, pendingProps);
  }

  render(reactElement, callback) {
    let root = this._internalRoot;
    
    let workInProgress = createWorkInProgress(root.current, null);
  }
}

const ReactDOM = {
  render(reactElement, container, callback) {
    isFirstRender = true;

    let root = new ReactRoot(container);
    container._reactRootContainer = root; 


    root.render(reactElement, callback);

    isFirstRender = false;
  }
}
