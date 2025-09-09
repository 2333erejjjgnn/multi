import express from 'express';
import fs from 'fs';
import path from 'path';
import { nanoid } from 'nanoid';

const app = express();
app.use(express.json({limit:'50kb'}));
const DATA_FILE = path.resolve('./server/data.json');
let db = {};
try{ db = JSON.parse(fs.readFileSync(DATA_FILE,'utf8')||'{}'); }catch(e){ db = {}; }

app.post('/save', (req,res)=>{
  const intent = req.body;
  if(!intent) return res.status(400).json({error:'missing intent'});
  const id = nanoid(8);
  db[id] = intent;
  fs.writeFileSync(DATA_FILE, JSON.stringify(db,null,2));
  res.json({id, url:`${req.protocol}://${req.get('host')}/${id}`});
});

app.get('/:id', (req,res,next)=>{
  const id = req.params.id;
  if(db[id]){
    const encoded = encodeURIComponent(JSON.stringify(db[id]));
    res.redirect(`/index.html?intent=${encoded}`);
  }else next();
});

app.use(express.static(path.resolve('./')));

const port = process.env.PORT||3000;
app.listen(port, ()=>console.log('server running on',port));
