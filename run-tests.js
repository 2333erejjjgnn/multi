import fs from 'fs';
import path from 'path';

const testsDir = path.resolve('./tests');
const files = fs.readdirSync(testsDir).filter(f=>f.endsWith('.js'));
let failed = 0;
for(const f of files){
  try{
    console.log(`Running ${f}`);
    await import(`./tests/${f}`);
  }catch(e){
    failed++;
    console.error(`Test ${f} failed:`, e);
  }
}
if(failed){
  console.error(`${failed} tests failed`);
  process.exit(1);
}
console.log('All tests passed');
