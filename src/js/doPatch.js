import { ATTR, REMOVE, REPLACE, TEXT } from "./patchTypes"
import { render, setAttrs } from "./virtualDom"

let finalPatches = {},
    rnIndex = 0

export default function doPatch (rDom, patches) {
  finalPatches = patches
  rNodeWalk(rDom)
}

function rNodeWalk (rNode) {
  const rnPatch = finalPatches[rnIndex ++],
        childNodes = Array.from(rNode.childNodes)
  console.log(childNodes)
  childNodes.map(child => {
    rNodeWalk(child)
  })

  if (rnPatch) {
    patchAction(rNode, rnPatch)
  }
}

function patchAction (rNode, rnPatch) {
  rnPatch.map(patch => {
    switch (patch.type) {
      case ATTR:
        for (let key in patch.attrs) {
          const value = patch.attrs[key]

          if (value) {
            setAttrs(rNode, key, value)
          } else {
            rNode.removeAttribute(key)
          }
        }
        break
      case TEXT:
        rNode.textContent = patch.text
        break
      case REPLACE:
        const newNode = (patch.newNode instanceof Element)
                        ? render(patch.newNode)
                        : document.createTextNode(patch.newNode)
        rNode.parentNode.replaceChild(newNode, rNode)
        break
      case REMOVE:
        rNode.parentNode.removeChild(rNode)
        break
      default:
        break
    }
  })
}