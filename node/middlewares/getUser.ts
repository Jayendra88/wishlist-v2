export async function getUser(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { user: GetUser },
  } = ctx

  const email: string = ctx.vtex.route.params.email as string
  const data = await GetUser.getUser(email)

  ctx.body = data
  ctx.status = 200
  ctx.set('cache-control', 'no-cache, no-store, must-revalidate, max-age=0')
  await next()
}
