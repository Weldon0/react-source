function reconcileSingleElement(
    returnFiber: Fiber,
    currentFirstChild: Fiber | null,
    element: ReactElement,
    expirationTime: ExpirationTime,
    ): Fiber {
    const key = element.key;
    let child = currentFirstChild;
    while (child !== null) {
        // 判断key是否相等
        if (child.key === key) {
            if (child.tag === Fragment ? element.type === REACT_FRAGMENT_TYPE : child.type === element.type) {
                // key相等且type相等，删除旧子节点的兄弟节点，复用旧节点并返回
                deleteRemainingChildren(returnFiber, child.sibling);
                const existing = useFiber(child, element.type === REACT_FRAGMENT_TYPE ? element.props.children : element.props, expirationTime,);
                existing.ref = coerceRef(returnFiber, child, element);
                existing.return = returnFiber;
                return existing;
            } else {
                // key相等但type不相等，删除旧子节点及兄弟节点，跳出循环
                deleteRemainingChildren(returnFiber, child);
                break;
            }
        } else {
            // key不相等，删除此旧子节点，继续循环
            deleteChild(returnFiber, child);
        }
        // 继续遍历此旧子节点的兄弟节点
        child = child.sibling;
    }
    // 不能复用，则直接新建Fiber实例，并返回
    if (element.type === REACT_FRAGMENT_TYPE) {
        const created = createFiberFromFragment(element.props.children, returnFiber.mode, expirationTime,
        element.key,);
        created.return = returnFiber;
        return created;
    } else {
        const created = createFiberFromElement(element, returnFiber.mode, expirationTime,);
        created.ref = coerceRef(returnFiber, currentFirstChild, element);
        created.return = returnFiber;
        return created;
    }
}