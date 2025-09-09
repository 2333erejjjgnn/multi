import { initRotator } from '../src/ui.js';

const ctrl = initRotator();
if(typeof ctrl !== 'function') throw new Error('initRotator should return a function');
ctrl();
console.log('ui.test.js passed');
