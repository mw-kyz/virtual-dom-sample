import Element from "./Element";

export function createElement(type, props, children) {
  return new Element(type, props, children)
}

export function render(vDom) {
  const { type, props, children } = vDom,
        el = document.createElement(type)
  
  for( let key in props) {
    setAttrs(el, key, props[key])
  }

  children.map(child => {
    // 如果子节点还是createElement创造出来的元素节点，就需要递归
    if (child instanceof Element) {
      child = render(child)
    } else {
      // 如果是文本节点，直接创建一个文本节点并赋值
      child = document.createTextNode(child)
    }

    el.appendChild(child)
  })

  return el
}

// 封装设置属性的方法
export function setAttrs(node, prop, value) {
  switch (prop) {
    case 'value':
      if (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA') {
        // input 和 textarea标签的 vaue 属性不能通过setAttribute设置，需要通过 node.value 设置，所以这里需要特殊处理
        node.value = value
      } else {
        node.setAttribute(prop, value)
      }
      break
    case 'style':
      node.style.cssText = value
      break
    default:
      node.setAttribute(prop, value)
      break
  }
}

export function renderDOM (rDom, rootEl) {
  rootEl.appendChild(rDom)
}