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
  // 确定根节点 root
  root = nextWorkOfUnit
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

let root = null

let nextWorkOfUnit = null
function workLoop(deadline) {
  // 是否应该让步
  let shouldYeild = false
  while (!shouldYeild && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit)
    shouldYeild = deadline.timeRemaining() < 1
  }

  // 链表结束 且 确保执行一次，有根的时候执行
  if (!nextWorkOfUnit && root) {
    commitRoot()
  }

  requestIdleCallback(workLoop)
}

function commitRoot() {
  commitWork(root.child)
  // 让commitRoot函数只执行一次
  root = null
}

function commitWork(fiber) {
  if (!fiber) return
  let fiberParent = fiber.parent;
  // 这里就是 function component ， 没dom, 那么就继续向上👆, 所以这里应该是while,避免多个FC component
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent;
  }

  const domParent = fiberParent.dom;
  // fiber.dom存在的时候再去添加，去除FC的情况，因为FC 的 fiber.dom 是null
  if (fiber.dom) {
    // 当前的dom 添加到父级dom里
    domParent.append(fiber.dom);
  }

  // 递归子节点
  commitWork(fiber.child);
  // 递归兄弟节点
  commitWork(fiber.sibling);
}

function createDom(type) {
  return  type === 'TEXT_ELEMENT'
  ? document.createTextNode('') 
  : document.createElement(type)
}

function updateProps (dom, props) {
  Object.keys(props).forEach((key) => {
    if (key !== 'children') {
      dom[key] = props[key]
    }
  })
}

function initChildren(fiber, children) {
  // const children = fiber.props.children
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

function updateHostText(fiber) {
  // 区分是否是 function component，是的话，包装为数组【】
  // [fiber.type(fiber.props)] 中的 fiber.props 为实现 FC 的props 传递
  const children = fiber.props.children || [];
  // 转换： DOM tree -> 链表，遵循DFS+BFS递归
  initChildren(fiber, children);
}

function updateFunctionComponent(fiber) {
  const children = [fiber.type(fiber.props)];

  // 转换： DOM tree -> 链表，遵循DFS+BFS递归
  initChildren(fiber, children);
}

function performWorkOfUnit(fiber) {
  const isFunctionComponent = typeof fiber.type === "function";

  // 不是 isFunctionComponent 是再去 c dom
  if (!isFunctionComponent) {
    if (!fiber.dom) {
      const dom = (fiber.dom = createDom(fiber.type))
      // fiber.parent.dom.append(dom)

      updateProps(dom, fiber.props)
    }
  }
  if (isFunctionComponent) {
    updateFunctionComponent(fiber)
  } else {
    updateHostText(fiber);
  }
  
  // // 区分是否是 function component，是的话，包装为数组【】
  // // [fiber.type(fiber.props)] 中的 fiber.props 为实现 FC 的props 传递
  // const children = isFunctionComponent
  //   ? [fiber.type(fiber.props)]
  //   : fiber.props.children || [];
  // // 转换： DOM tree -> 链表，遵循DFS+BFS递归
  // initChildren(fiber, children);

  // 继续执行下一个返回的任务
  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  // while 处理sibling 时的情况，有sibling 时返回sibling，没有则返回 parent
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling;
    nextFiber = nextFiber.parent;
  }
  // return fiber.parent?.sibling;
}

const React = {
  render,
  createElement,
}

export default React