// v1
// const dom = document.createElement('div')
// dom.id = 'app'
// document.querySelector('#root').append(dom)

// const textNode = document.createTextNode('')
// textNode.nodeValue = 'mydu'
// dom.append(textNode)

// v2  react vdom -> js对象 
// type props children
// const textEl = {
//   type: 'TEXT_ELEMENT',
//   props: {
//     nodeValue: 'mydu',
//     children: [],
//   }

// }
// const el = {
//   type: 'div',
//   props: {
//     id: 'app',
//     children: [textEl],
//   }
// }

// const dom = document.createElement(el.type)
// dom.id = el.props.id
// document.querySelector('#root').append(dom)

// const textNode = document.createTextNode('')
// textNode.nodeValue = textEl.props.nodeValue
// dom.append(textNode)

// v3
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
// function render(el, container) {
//   const dom = el.type === 'TEXT_ELEMENT' ? 
//               document.createTextNode('') 
//               : document.createElement(el.type)
//   Object.keys(el.props).forEach((key) => {
//     if (key !== 'children') {
//       dom[key] = el.props[key]
//     }
//   })
//   // 注意不要忘记对children进行递归处理
//   const children = el.props.children
//   children.forEach((child) => {
//     render(child, dom)
//   })
//   container.append(dom)
// }

// // const textEl = createTextNode('mydu')
// // const App = createElement('div', {id: 'app'}, textEl)
// // render(App, document.querySelector('#root'))

// const ReactDom = {
//   createRoot(container) {
//     return {
//       render(App) {
//         render(App, container)
//       }
//     }
//   }
// }

// const App = createElement('div', {id: 'app'}, 'mydu')
// ReactDom.createRoot(document.querySelector('#root')).render(App)

// v4 代码抽象
import ReactDom from "./core/ReactDom.js"
import React from "./core/React.js"

const App = React.createElement('div', {id: 'app'}, 'mydu')
ReactDom.createRoot(document.querySelector('#root')).render(App)