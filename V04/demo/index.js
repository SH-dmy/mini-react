let taskId = 1
function workLoop(deadline) {
  // console.log(deadline.timeRemaining())
  taskId++

  // 是否应该让步
  let shouldYeild = false
  while (!shouldYeild) {
    // run task
    console.log(`taskId:${taskId} run task`)

    shouldYeild = deadline.timeRemaining() < 1
  }

  requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)