import { GoogleAPI } from 'https://deno.land/x/google_deno_integration/mod.ts';
import { Application, Router } from 'https://deno.land/x/oak/mod.ts';
import { encode, decode } from 'https://deno.land/std/encoding/base64.ts'
const env = Deno.env.toObject();
const app = new Application();
const router = new Router();
const domain = 'greenhouse.io';
const gapiAccess = { //Expiration and aud are optional
  email: env.GAPI_EMAIL,
  scope: [env.GAPI_SCOPE],
  key: new TextDecoder().decode(decode(env.GAPI_KEY_BASE64)),
};
const gapi = new GoogleAPI(gapiAccess);
const x = await gapi.get('https://sheets.googleapis.com/v4/spreadsheets/1Eahbvn759k_wnyv6jq1DVFi61YCIbekq3Rs7EhsV01A?fields=sheets.properties.title');
console.log(x);
//////////////
router
.get('/', (ctx) => { //Appends required text to address and redirect
  ctx.response.redirect(`/${domain}?` + ctx.request.url.searchParams);
})
.get(`/${domain}`, (ctx) => { //Required text already present in address
  logSheet();
  let p = ctx.request.url.searchParams;
  let name = p.get('name') ?? 'First Last';
  let phone = p.get('phone') ?? '+1-555-555-5555';
  ctx.response.body = new TextEncoder().encode(`
<head><title>Qualify lead</title></head>
<body>
  <p class='person-name'>${name}</p>
  <p>${phone}</p>
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
