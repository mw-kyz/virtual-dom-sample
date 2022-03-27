import { createElement, render, renderDOM } from "./virtualDom";
import domDiff from './domDiff'
import doPatch from "./doPatch";

const vDom = createElement(
  'ul',
  {
    class: 'list',
    style: 'width: 300px; height: 300px; background-color: orange',
  },
  [
    createElement(
      'li',
      {
        class: 'item',
        'data-index': 0,
      },
      [createElement('p', { class: 'text' }, ['第一个列表项'])]
    ),
    createElement(
      'li',
      {
        class: 'item',
        'data-index': 1,
      },
      [
        createElement('p', { class: 'text' }, [
          createElement('span', { class: 'title' }, ['第二个列表项'])
        ])
      ]
    ),
    createElement(
      'li',
      {
        class: 'item',
        'data-index': 2,
      },
      ['第三个列表项']
    )
  ]
)

console.log(vDom)

const rDom = render(vDom)

renderDOM(
  rDom,
  document.getElementById('app')
)

const newVDom = createElement(
  'ul',
  {
    class: 'list-wrap',
    style: 'width: 300px; height: 300px; background-color: orange',
  },
  [
    createElement(
      'li',
      {
        class: 'item',
        'data-index': 0,
      },
      [createElement('p', { class: 'title' }, ['特殊列表项'])]
    ),
    createElement(
      'li',
      {
        class: 'item',
        'data-index': 1,
      },
      [
        createElement('p', { class: 'text' }, [])
      ]
    ),
    createElement(
      'div',
      {
        class: 'item',
        'data-index': 2,
      },
      ['第三个列表项']
    )
  ]
)

const patches = domDiff(vDom, newVDom)

console.log(patches)

setTimeout(() => {
  doPatch(rDom, patches)
}, 3000)

console.log(rDom)
