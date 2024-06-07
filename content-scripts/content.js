import './content.css'

let mode = null
let lastElement = null

let lastRemovedElement = null
let lastRemovedElementParent = null
let lastRemovedElementSibling = null

let trackMouseOld = window.onmousemove

console.log('inject content.js')

function trackMouseNewspaperClipping(event) {
  var currentElement = document.elementFromPoint(event.clientX, event.clientY)

  if (!currentElement) {
    return
  }

  if (currentElement === lastElement) {
    return
  }

  if (lastElement) {
    lastElement.classList.remove('nc-delete-mask')
  }
  currentElement.classList.add('nc-delete-mask')
  lastElement = currentElement

  currentElement.onclick = function (e) {
    e.preventDefault()

    if (lastElement) {
      console.log(lastElement.nodeName)
      let nodeName = lastElement.nodeName.toLowerCase()
      if (nodeName == 'html' || nodeName == 'body') {
        console.log('can not remove html or body')

        return
      }

      lastRemovedElement = lastElement
      lastRemovedElementParent = lastElement.parentElement
      lastRemovedElementSibling = lastElement.nextSibling

      lastElement.remove()
      lastElement = null
    }

    return false
  }
}

function trackMouseCapture(event) {
  var currentElement = document.elementFromPoint(event.clientX, event.clientY)

  if (!currentElement) {
    return
  }

  if (currentElement === lastElement) {
    return
  }

  if (lastElement) {
    lastElement.classList.remove('nc-capture-mask')
  }
  currentElement.classList.add('nc-capture-mask')
  lastElement = currentElement

  currentElement.onclick = function (e) {
    e.preventDefault()
    return false
  }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request)

  if ('CONTENT' != request.target) {
    return
  }

  if ('get' == request.method && 'mode' == request.res) {
    sendResponse({ mode: mode })

    return
  }

  if ('put' == request.method && 'mode' == request.res) {
    mode = request.data
    console.log(mode)

    if ('newspaper-clipping' === mode) {
      window.onmousemove = trackMouseNewspaperClipping
    } else if ('capture' === mode) {
      window.onmousemove = trackMouseCapture
    } else {
      window.onmousemove = trackMouseOld
    }

    if (lastElement) {
      lastElement.classList.remove('nc-delete-mask')
      lastElement.classList.remove('nc-capture-mask')
      lastElement = null
    }

    console.log('response mode: ' + { mode: mode})
    sendResponse({ mode: mode })
  }

  if ('post' == request.method && 'undo' == request.res) {
    if (lastRemovedElement && lastRemovedElementParent) {
      lastRemovedElementParent.insertBefore(
        lastRemovedElement,
        lastRemovedElementSibling
      )
      lastRemovedElement.classList.remove('nc-delete-mask')

      lastRemovedElement = null
      lastRemovedElementParent = null
      lastRemovedElementSibling = null

      sendResponse({ undo: true })
    } else {
      sendResponse({ undo: false })
    }
  }
})
