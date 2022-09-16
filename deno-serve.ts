import { Application, Router } from 'https://deno.land/x/oak/mod.ts';
const app = new Application();
const router = new Router();
const domain = 'greenhouse.io';
router
.get("/", (ctx) => {
  ctx.response.redirect(`/${domain}?` + ctx.request.url.searchParams);
})
.get(`/${domain}`, (ctx) => {
  let personName: string = ctx.request.url.searchParams.get('personName');
  let phoneNumber: string = ctx.request.url.searchParams.get('phoneNumber');
  ctx.response.body = new TextEncoder().encode(`
<head><title>Qualify lead</title></head>
<body>
  <p class="person-name">${personName}</p>
  <p>${phoneNumber}</p>
</body>
    `
)});
app.use(router.routes());
app.use(router.allowedMethods());
await app.listen({ port: 80 })
