import { json } from 'co-body'

export async function addUser(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { addUser: user },
  } = ctx

  const reqBody = json(ctx.req)
  const data = await user.addUser(reqBody)

  ctx.body = data
  ctx.status = 200
  ctx.set('cache-control', 'no-cache, no-store, must-revalidate, max-age=0')
  await next()
}
