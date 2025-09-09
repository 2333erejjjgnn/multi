import { q, qid, trapFocus, createEl } from './dom.js';
import { buildIntent, serializeIntent, saveIntentToHistory, loadIntentHistory, clearIntentHistory } from './intent.js';

const form = qid('swapForm');
const output = qid('output');

function setTyping(on){ }

form.addEventListener('submit', async (ev)=>{
  ev.preventDefault();
  setTyping(true);
  const nftId = qid('nftId').value.trim();
  const currentChain = qid('currentChain').value;
  const targetChain = qid('targetChain').value;
  const desiredType = qid('desiredType').value.trim();
  if(!nftId){
    output.textContent = 'Please provide an NFT identifier';
    setTyping(false);
    return;
  }
  const intent = buildIntent({nftId,currentChain,targetChain,desiredType});
  saveIntentToHistory(intent);
  const json = serializeIntent(intent);
  output.innerHTML = `<h3>Intent</h3><pre>${json}</pre>`;
  const copyBtn = createEl('button',{class:'copy-btn'});
  copyBtn.textContent = 'Copy JSON';
  copyBtn.addEventListener('click',async ()=>{
    await navigator.clipboard.writeText(json);
    copyBtn.classList.add('success');
    copyBtn.textContent = 'Copied';
    setTimeout(()=>{copyBtn.classList.remove('success');copyBtn.textContent='Copy JSON'},1500);
  });
  output.appendChild(copyBtn);
  const dl = createEl('button',{class:'action-btn'});
  dl.textContent = 'Download';
  dl.addEventListener('click',()=>{
    const blob = new Blob([json],{type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = createEl('a',{href:url,download:'intent.json'});
    a.click();
    URL.revokeObjectURL(url);
  });
  output.appendChild(dl);
  const share = createEl('button',{class:'action-btn'});
  share.textContent='Share';
  share.addEventListener('click',async ()=>{
    try{
      const res = await fetch('/save',{method:'POST',headers:{'content-type':'application/json'},body:json});
      const body = await res.json();
      const link = `${location.origin}/${body.id}`;
      output.appendChild(createEl('div')).textContent = link;
    }catch(e){
      const encoded = encodeURIComponent(json);
      const link = `${location.origin}/?intent=${encoded}`;
      output.appendChild(createEl('div')).textContent = link;
    }
  });
  output.appendChild(share);
  setTyping(false);
});

(function(){
  const hist = loadIntentHistory();
  if(!hist || !hist.length) return;
  const hcont = qid('history') || document.createElement('div');
  hcont.innerHTML = '<h4>History</h4>';
  const list = hist.slice(0,10);
  list.forEach(item=>{
    const b = document.createElement('button');
    const ts = item.savedAt ? new Date(item.savedAt).toLocaleString() : '';
    b.innerHTML = `<div class="history-id">${item.nft && item.nft.id || 'saved'}</div><div class="history-ts">${ts}</div>`;
    b.addEventListener('click',()=>{
      qid('nftId').value = item.nft && item.nft.id || '';
      qid('currentChain').value = item.nft && item.nft.chain || 'polygon';
      qid('targetChain').value = item.target && item.target.chain || 'ethereum';
    });
    hcont.appendChild(b);
  });
  const clear = createEl('button',{class:'action-btn'});
  clear.textContent = 'Clear History';
  clear.addEventListener('click',()=>{ clearIntentHistory(); hcont.innerHTML = '<h4>History</h4>'; });
  hcont.appendChild(clear);
  if(!qid('history')) document.body.appendChild(hcont);
})();

(function(){
  const params = new URLSearchParams(location.search);
  if(params.has('intent')){
    try{
      const decoded = decodeURIComponent(params.get('intent'));
      const parsed = JSON.parse(decoded);
      qid('nftId').value = parsed.nft && parsed.nft.id || '';
      qid('currentChain').value = parsed.nft && parsed.nft.chain || 'polygon';
      qid('targetChain').value = parsed.target && parsed.target.chain || 'ethereum';
    }catch(e){}
  }
})();
