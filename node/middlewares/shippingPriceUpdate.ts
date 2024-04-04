import { json } from 'co-body'

import updatePrice from '../helpers/updatePrice'

export async function shippingPriceUpdate(
  ctx: Context,
  next: () => Promise<any>
) {
  const reqBody = await json(ctx.req)

  updatePrice(ctx, reqBody)

  const updatePriceResponse = await updatePrice(ctx, reqBody)

  ctx.body = updatePriceResponse.data

  await next()
}
