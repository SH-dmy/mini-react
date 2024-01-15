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
  nextWorkOfUnit = {
    dom: container,
    props: {
      children: [el],
    },
  }
  // const dom = el.type === 'TEXT_ELEMENT' ? 
  //             document.createTextNode('') 
  //             : document.createElement(el.type)
  // Object.keys(el.props).forEach((key) => {
  //   if (key !== 'children') {
  //     dom[key] = el.props[key]
  //   }
  // })
  // // 注意不要忘记对children进行递归处理
  // const children = el.props.children
  // children.forEach((child) => {
  //   render(child, dom)
  // })
  // container.append(dom)
}

let nextWorkOfUnit = null
function workLoop(deadline) {

  // 是否应该让步
  let shouldYeild = false
  while (!shouldYeild && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit)

    shouldYeild = deadline.timeRemaining() < 1
  }

  requestIdleCallback(workLoop)
}
requestIdleCallback(workLoop)

function createDom(type) {
  return  type === 'TEXT_ELEMENT'
  ? document.createTextNode('') 
  : document.createElement(work.type)
}

function updateProps (dom, props) {
  Object.keys(props).forEach((key) => {
    if (key !== 'children') {
      dom[key] = props[key]
    }
  })
}

function initChildren(fiber) {
  const children = fiber.props.children
  let prevChild = null
  children.forEach((child, index) => {
    const newFiber = {
      type: child.type,
      props: child.props,
      child: null,
      parent: fiber,
      sibling: null,
      dom: null, 
    }

    if (index === 0) {
      fiber.child = newFiber
    } else {
      prevChild.sibling = newFiber
    }
    prevChild = newFiber
  })
}

function performWorkOfUnit(fiber) {
  // 1. 创建dom
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type))
    fiber.parent.dom.append(dom)

    // 2. 处理props
    updateProps(dom, fiber.props)
  }

  // 3. 转换链表 设置好指针
  initChildren(fiber)

  // 4. 返回下一个要执行的任务
  // 孩子 兄弟 叔叔
  if (fiber.child) {
    return fiber.child
  }
  if (fiber.sibling) {
    return fiber.sibling
  }
  return fiber.parent?.sibling 
}

const React = {
  render,
  createElement,
}

export default React