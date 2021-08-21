// node_walk: walk the element tree, stop when func(node) returns false
function node_walk(node: ChildNode | null, func: (e: ChildNode | null) => unknown) {
  let result = func(node);
  if (node) {
    for(node = node.firstChild; result !== false && node; node = node.nextSibling)
      result = node_walk(node, func);
  }
  return result;
}

export function getCaretPosition(elem: HTMLElement): [number, number] | undefined {
  let sel = window.getSelection();
  if (sel) {
    console.log(sel.anchorOffset, sel.focusOffset)
    return [sel.anchorOffset, sel.focusOffset]
  }
  return undefined
}

export function isCaretOnLastLine(elem: HTMLElement): boolean {
  let sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) {
    return false
  }
  const range = sel.getRangeAt(0)
  const boundings = range.getBoundingClientRect();
  console.log(boundings, elem.getBoundingClientRect())
  console.log("isCaret on last line", boundings.bottom + 5 >= elem.getBoundingClientRect().bottom)
  return boundings.bottom + 5 >= elem.getBoundingClientRect().bottom
}

export function isCaretOnFirstLine(elem: HTMLElement): boolean {
  let sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) {
    return false
  }
  const range = sel.getRangeAt(0)
  const boundings = range.getBoundingClientRect();
  console.log(boundings, elem.getBoundingClientRect())
  console.log("isCaret on last line", boundings.bottom + 5 <= elem.getBoundingClientRect().bottom)
  return boundings.bottom <= elem.getBoundingClientRect().bottom
}

// function isNodeInSubtree(): boolean {
//
// }
// export function getCaretPosition(elem: HTMLElement) {
//   let sel = window.getSelection();
//   let cum_length = [0, 0];
//   if (sel === null) {
//     return undefined
//   }
//   if(sel.anchorNode == elem)
//     cum_length = [sel.anchorOffset, sel.extentOffset];
//   else {
//     var nodes_to_find = [sel.anchorNode, sel.extentNode];
//     if(!elem.contains(sel.anchorNode) || !elem.contains(sel.extentNode))
//       return undefined;
//     else {
//       var found = [0,0];
//       var i;
//       node_walk(elem, function(node) {
//         for(i = 0; i < 2; i++) {
//           if(node == nodes_to_find[i]) {
//             found[i] = true;
//             if(found[i == 0 ? 1 : 0])
//               return false; // all done
//           }
//         }
//
//         if(node.textContent && !node.firstChild) {
//           for(i = 0; i < 2; i++) {
//             if(!found[i])
//               cum_length[i] += node.textContent.length;
//           }
//         }
//       });
//       cum_length[0] += sel.anchorOffset;
//       cum_length[1] += sel.extentOffset;
//     }
//   }
//   if(cum_length[0] <= cum_length[1])
//     return cum_length;
//   return [cum_length[1], cum_length[0]];
// }
