export function setProps(dom, oldProps, newProps) {
  for (let key in oldProps) {
    if (key !== 'children') {
      if (newProps.hasOwnProperty(key)) {
        setProp(dom, key, newProps[key]); // old new都有，更新
      } else {
        dom.removeAttribute(key); // old有，新的没有
      }
    }
    
  }
  for (let key in newProps) {
    if (key !== 'children') {
      if (!oldProps.hasOwnProperty(key)) { // old没有，新有，add
        setProp(dom, key, newProps[key]);
      }
    }
  }
}

function setProp(dom, key, value) {
  if (dom?.nodeName === '#text') return; // 忽略问本节点
  if (/^on/.test(key)) { // onclick
    dom[key.toLowerCase()] = value; // 没有合成事件
  } else if(key === 'style') {
    if (value) {
      for (const styleName in value) {
        dom.style[styleName] = value[styleName];
      }
    }
  } else {
    dom.setAttribute(key, value); // 其他属性直接赋值
  }
}