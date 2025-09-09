import { buildIntent, serializeIntent } from '../src/intent.js';

function assertEqual(a,b,msg){ if(JSON.stringify(a)!==JSON.stringify(b)) throw new Error(msg||`Assertion failed: ${JSON.stringify(a)} != ${JSON.stringify(b)}`)}

const intent = buildIntent({nftId:'#123', currentChain:'polygon', targetChain:'ethereum', desiredType:'Rare'});
assertEqual(intent.type,'swap-intent','type mismatch');
assertEqual(typeof intent.created,'string','missing created');
const json = serializeIntent(intent);
const parsed = JSON.parse(json);
assertEqual(parsed.nft.id,'#123','nftId mismatch');
console.log('intent.test.js passed');
