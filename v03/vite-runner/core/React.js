function createTextNode(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: [],
    }
  }
}

function createElement(type, props, ...children) {
  console.log('hehehehe')
  return {
    type: type,
    props: {
      ...props,
      children: children.map((child) => {
        return typeof child === 'string' ? createTextNode(child) : child
      }),
    }
  }
}

// 创建节点 设置props 将节点加入到容器中
function render(el, container) {
  const dom = el.type === 'TEXT_ELEMENT' ? 
              document.createTextNode('') 
              : document.createElement(el.type)
  Object.keys(el.props).forEach((key) => {
    if (key !== 'children') {
      dom[key] = el.props[key]
    }
  })
  // 注意不要忘记对children进行递归处理
  const children = el.props.children
  children.forEach((child) => {
    render(child, dom)
  })
  container.append(dom)
}

const React = {
  render,
  createElement,
}

export default React