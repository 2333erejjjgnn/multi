export function q(selector){ return document.querySelector(selector); }
export function qid(id){ return document.getElementById(id); }
export function createEl(tag, props={}){
  const el = document.createElement(tag);
  Object.entries(props).forEach(([k,v])=> el.setAttribute(k,v));
  return el;
}

export function trapFocus(container){
  if(!container) return ()=>{};
  const focusable = 'a[href],area[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),button:not([disabled]),[tabindex]:not([tabindex="-1"])';
  const nodes = Array.from(container.querySelectorAll(focusable)).filter(n=>n.offsetParent!==null);
  if(!nodes.length) return ()=>{};
  let first = nodes[0], last = nodes[nodes.length-1];
  function handler(e){
    if(e.key !== 'Tab') return;
    if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
    else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
  }
  document.addEventListener('keydown', handler);
  return ()=>document.removeEventListener('keydown', handler);
}
