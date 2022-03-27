import {
  ATTR,
  TEXT,
  REPLACE,
  REMOVE
} from './patchTypes'

let patches = {},
    vnIndex = 0

export default function domDiff (oldVDOM, newVDom) {
  let index = 0

  vnodeWalk(oldVDOM, newVDom, index)

  return patches
}

function vnodeWalk (oldNode, newNode, index) {
  let vnPatch = []

  // 如果新节点不存在，就代表旧节点被删除了
  if (!newNode) {
    vnPatch.push({
      type: REMOVE,
      index
    })
  } else if (typeof oldNode === 'string' && typeof newNode === 'string') {
    // 文本节点的改变
    if (oldNode !== newNode) {
      vnPatch.push({
        type: TEXT,
        text: newNode
      })
    }
  } else if (oldNode.type === newNode.type) { // 此处的type为虚拟节点的标签名，即Element创建出来的虚拟节点
    // 获取属性变化的补丁
    const attrPatch = attrsWalk(oldNode.props, newNode.props)
    // 如果不是空对象，说明有修改
    if (Object.keys(attrPatch).length > 0) {
      vnPatch.push({
        type: ATTR,
        attrs: attrPatch
      })
    }

    childrenWalk(oldNode.children, newNode.children)
  } else { // 替换节点
    vnPatch.push({
      type: REPLACE,
      newNode
    })
  }

  if (vnPatch.length > 0) {
    patches[index] = vnPatch
  }
}

function attrsWalk(oldAttrs, newAttrs) {
  let attrPatch = {}

  for (let key in oldAttrs) {
    // 修改或删除属性，加入补丁
    if (oldAttrs[key] !== newAttrs[key]) {
      attrPatch[key] = newAttrs[key]
    }
  }
  
  for (let key in newAttrs) {
    // 新增属性，加入补丁
    if (!oldAttrs.hasOwnProperty(key)) {
      attrPatch[key] = newAttrs[key]
    }
  }

  return attrPatch
}

function childrenWalk(oldChildren, newChildren) {
  oldChildren.map((child, idx) => {
    vnodeWalk(child, newChildren[idx], ++vnIndex)
  })
}