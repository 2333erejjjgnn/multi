const form = document.getElementById('swapForm')
const output = document.getElementById('output')

function normalizeChain(value){
  if(!value) return ''
  return String(value).trim().toLowerCase()
}

function renderIntent(intent){
  const json = JSON.stringify(intent, null, 2)
  output.innerHTML = `
    <h3>Generated Intent</h3>
    <pre id="intentJson">${json}</pre>
    <div class="copy-row">
  <button id="copyBtn" class="copy-btn">Copy JSON</button>
  <button id="downloadBtn" class="action-btn">Download</button>
  <button id="shareBtn" class="action-btn">Copy Link</button>
  <button id="clearBtn" class="copy-btn">Clear</button>
    </div>
  `

  document.getElementById('copyBtn').addEventListener('click', async ()=>{
    await navigator.clipboard.writeText(json)
  })

  document.getElementById('clearBtn').addEventListener('click', ()=>{ output.innerHTML = '' })

  document.getElementById('downloadBtn').addEventListener('click', ()=>{
    const blob = new Blob([json], {type:'application/json'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `nft-intent-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  })

  document.getElementById('shareBtn').addEventListener('click', async ()=>{
    const encoded = encodeURIComponent(json)
    const shareUrl = `${location.origin}${location.pathname}?intent=${encoded}`
    await navigator.clipboard.writeText(shareUrl)
  })
}

form.addEventListener('submit', function(e){
  e.preventDefault()
  const nftId = (document.getElementById('nftId').value || '').trim()
  const currentChain = normalizeChain(document.getElementById('currentChain').value)
  const targetChain = normalizeChain(document.getElementById('targetChain').value)
  const desiredType = (document.getElementById('desiredType').value || '').trim()

  if(!nftId){
    output.textContent = 'Please provide an NFT identifier.'
    return
  }
  if(currentChain === targetChain){
    output.textContent = 'Current chain and target chain must be different.'
    return
  }

  const intent = {
    version: '1.0',
    type: 'NFT_SWAP',
    from: { nftId, chain: currentChain },
    to: { desiredType: desiredType || null, chain: targetChain },
    createdAt: new Date().toISOString()
  }

  renderIntent(intent)
})