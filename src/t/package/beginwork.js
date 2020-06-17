function beginWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderExpirationTime: ExpirationTime,
): Fiber | null {
  const updateExpirationTime = workInProgress.expirationTime;
  if (!hasLegacyContextChanged() && (updateExpirationTime === NoWork || updateExpirationTime > renderExpirationTime)) {
    switch (workInProgress.tag) {
      case HostRoot:
        ...
      case HostComponent:
        ...
        break;
      case ClassComponent:
        pushLegacyContextProvider(workInProgress);
        break;
      case HostPortal:
        ...
      case ContextProvider:
        ...
      case Profiler:
        ...
    }
    return bailoutOnAlreadyFinishedWork(current, workInProgress, renderExpirationTime,);
  }

  // Before entering the begin phase, clear the expiration time.
  workInProgress.expirationTime = NoWork;

  switch (workInProgress.tag) {
    case IndeterminateComponent:
      return mountIndeterminateComponent(current, workInProgress, renderExpirationTime,);
    case FunctionalComponent:
      return updateFunctionalComponent(current, workInProgress, renderExpirationTime,);
    case ClassComponent:
      return updateClassComponent(current, workInProgress, renderExpirationTime,);
    case HostRoot:
      return updateHostRoot(current, workInProgress, renderExpirationTime);
    case HostComponent:
      return updateHostComponent(current, workInProgress, renderExpirationTime);
    case HostText:
      return updateHostText(current, workInProgress);
    case PlaceholderComponent:
      return updatePlaceholderComponent(current, workInProgress, renderExpirationTime,);
    case HostPortal:
      return updatePortalComponent(current, workInProgress, renderExpirationTime,);
    case ForwardRef:
      return updateForwardRef(current, workInProgress, renderExpirationTime);
    case Fragment:
      return updateFragment(current, workInProgress, renderExpirationTime);
    case Mode:
      return updateMode(current, workInProgress, renderExpirationTime);
    case Profiler:
      return updateProfiler(current, workInProgress, renderExpirationTime);
    case ContextProvider:
      return updateContextProvider(current, workInProgress, renderExpirationTime,);
    case ContextConsumer:
      return updateContextConsumer(current, workInProgress, renderExpirationTime,);
    default:
      ...
  }
}