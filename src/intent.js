export function buildIntent({nftId, currentChain, targetChain, desiredType}){
  return {
    version:1,
    type:'swap-intent',
    created: new Date().toISOString(),
    nft:{ id: nftId, chain: currentChain },
    target:{ chain: targetChain, desired: desiredType || null }
  };
}

export function serializeIntent(intent){
  return JSON.stringify(intent, null, 2);
}

const LS_KEY = 'mc_nft_intents_v1';
export function saveIntentToHistory(intent){
  try{
  const arr = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
  const record = Object.assign({}, intent, { savedAt: Date.now() });
  arr.unshift(record);
  localStorage.setItem(LS_KEY, JSON.stringify(arr.slice(0,20)));
  }catch(e){}
}

export function loadIntentHistory(){
  try{
    return JSON.parse(localStorage.getItem(LS_KEY) || '[]');
  }catch(e){ return []; }
}

export function clearIntentHistory(){
  try{ localStorage.removeItem(LS_KEY); }catch(e){}
}
