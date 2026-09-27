import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';

const root=process.cwd();
const host=process.env.HOST||'127.0.0.1';
const port=Number(process.env.PORT)||5173;
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8'};
const headers={
  'Cache-Control':'no-cache',
  'Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'",
  'Permissions-Policy':'camera=(), microphone=(), geolocation=()',
  'Referrer-Policy':'no-referrer',
  'X-Content-Type-Options':'nosniff',
  'X-Frame-Options':'DENY'
};
const allowed=pathname=>pathname==='/'||pathname==='/index.html'||pathname==='/public/questions.json'||/^\/src\/[A-Za-z0-9._-]+\.(?:js|css)$/.test(pathname);
http.createServer(async(req,res)=>{
  try {
    const url=new URL(req.url,'http://localhost');
    const pathname=decodeURIComponent(url.pathname);
    if(!allowed(pathname)){res.writeHead(404,headers);res.end('Not found');return;}
    const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
    if(!file.startsWith(root+path.sep)){res.writeHead(404,headers);res.end('Not found');return;}
    const data=await readFile(file);
    res.writeHead(200,{...headers,'Content-Type':types[path.extname(file)]||'application/octet-stream'});res.end(data);
  }catch {res.writeHead(404,headers);res.end('Not found');}
}).listen(port,host,()=>console.log(`MockTest ready at http://${host}:${port}`));
