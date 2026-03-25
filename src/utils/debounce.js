// 防抖函数
// 延迟执行函数，在指定时间内多次调用只执行最后一次
export function debounce(func, delay = 300) {
  let timeoutId
  return function(...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

// 节流函数
// 限制函数执行频率，在指定时间内只执行一次
export function throttle(func, delay = 300) {
  let lastCall = 0
  return function(...args) {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      func.apply(this, args)
    }
  }
}

// 防抖函数（立即执行版）
// 立即执行函数，然后在指定时间内不再执行
export function debounceImmediate(func, delay = 300) {
  let timeoutId
  let isImmediate = true
  return function(...args) {
    if (isImmediate) {
      func.apply(this, args)
      isImmediate = false
    }
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      isImmediate = true
    }, delay)
  }
}

// 节流函数（使用定时器）
// 使用定时器实现的节流函数
export function throttleTimer(func, delay = 300) {
  let timeoutId
  return function(...args) {
    if (!timeoutId) {
      timeoutId = setTimeout(() => {
        func.apply(this, args)
        timeoutId = null
      }, delay)
    }
  }
}
