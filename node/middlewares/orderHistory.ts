// import convert from 'xml-js'
import { XMLParser } from 'fast-xml-parser'

import getBusinessDocument from '../helpers/getBusinessDocument'

export async function orderHistory(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { orderHistory: OrderHistory, prontoLogin: ProntoLogin },
  } = ctx

  let startAt: number | undefined

  if (ctx.request.query.startAt) {
    startAt = Number(ctx.request.query.startAt)
  }

  const document = await getBusinessDocument(ctx)

  const apiToken: any = await ProntoLogin.login()
  const XMLdata: any = await OrderHistory.getOrderHistory(
    apiToken.AuthInfo.token,
    startAt,
    document.businessDocument
  )

  const parser = new XMLParser()
  const jObj = parser.parse(XMLdata)

  const data = jObj

  ctx.body = data
  ctx.status = 200
  ctx.set('cache-control', 'no-cache, no-store, must-revalidate, max-age=0')
  await next()
}
