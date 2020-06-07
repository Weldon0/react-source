

export const ELEMENT_TEXT = Symbol.for('ELEMENT_TEXT'); // 表示文本元素
export const TAG_ROOT = Symbol.for('TAG_ROOT'); // 根fiber
export const TAG_HOST = Symbol.for('TAG_HOST'); // 原生节点 span p div 区分函数 组件类组件
export const TAG_TEXT = Symbol.for('TAG_TEXT'); // 文本节点
export const PLACEMENT = Symbol.for('PLACEMENT'); // 插入节点
export const UPDATE = Symbol.for('UPDATE'); // 更新节点
export const DELETION = Symbol.for('DELETION'); // 删除节点

// 文本节点 tag: TAG_TEXT  type: ELEMENT_TEXT
