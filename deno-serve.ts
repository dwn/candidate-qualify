import { Application, Router } from 'https://deno.land/x/oak/mod.ts';
const app = new Application();
const router = new Router();
const domain = 'greenhouse.io';
const sheetsURL = 'https://docs.google.com/spreadsheets/d/16mzGwtFLYBY2CDA3F8cSY6-iqQW8Ed4XeofeGVqqQAw/edit#gid=0'


router
.get("/", (ctx) => { //Appends required text to address and redirect
  ctx.response.redirect(`/${domain}?` + ctx.request.url.searchParams);
})
.get(`/${domain}`, (ctx) => { //Required text already present in address
  let p = ctx.request.url.searchParams;
  ctx.response.body = new TextEncoder().encode(`
<head><title>Qualify lead</title></head>
<body>
  <p class="person-name">${p.get('name')}</p>
  <p>${p.get('phone')}</p>
  <p>${p.get('userId')}</p>
  <p>${p.get('date')}</p>
  <p>${p.get('added')}</p>
  <p>${p.get('email')}</p>
  <p>${p.get('jobCategory')}</p>
  <p>${p.get('city')}</p>
  <p>${p.get('state')}</p>
  <p>${p.get('freeformResponse')}</p>
</body>
  `)});
app.use(router.routes());
app.use(router.allowedMethods());
await app.listen({ port: 80 })
