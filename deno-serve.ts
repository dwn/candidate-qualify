import { GoogleAPI } from 'https://deno.land/x/google_deno_integration/mod.ts';
import { Application, Router } from 'https://deno.land/x/oak/mod.ts';
const env = Deno.env.toObject();
const app = new Application();
const router = new Router();
const domain = 'greenhouse.io';
//////////////
const api = new GoogleAPI({ //Expiration and aud are optional
  email: env.GAPI_EMAIL,
  scope: [env.GAPI_SCOPE],
  key: env.GAPI_KEY,
});
const x = await api.get(
'https://sheets.googleapis.com/v4/spreadsheets/1Eahbvn759k_wnyv6jq1DVFi61YCIbekq3Rs7EhsV01A?fields=sheets.properties.title'
);
console.log(x);
//////////////
router
.get('/', (ctx) => { //Appends required text to address and redirect
  ctx.response.redirect(`/${domain}?` + ctx.request.url.searchParams);
})
.get(`/${domain}`, (ctx) => { //Required text already present in address
  logSheet();
  let p = ctx.request.url.searchParams;
  ctx.response.body = new TextEncoder().encode(`
<head><title>Qualify lead</title></head>
<body>
  <p class='person-name'>${p.get('name')}</p>
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
