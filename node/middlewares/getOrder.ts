import getBusinessDocument from '../helpers/getBusinessDocument'

export async function getOrder(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { orderHistory: OrderHistory, prontoLogin: ProntoLogin },
  } = ctx

  const orderId: string = ctx.vtex.route.params.id as string
  const document = await getBusinessDocument(ctx)

  const apiToken: any = await ProntoLogin.login()
  const data = await OrderHistory.getOrder(
    apiToken.AuthInfo.token,
    orderId,
    document.businessDocument
  )

  ctx.body = data
  ctx.status = 200
  ctx.set('cache-control', 'no-cache, no-store, must-revalidate, max-age=0')
  await next()
}
