import type { ShippingPriceUpdateResponse } from '../typings/freightcom'

export default async function updatePrice(ctx: Context, reqBody: any) {
  const {
    clients: { shippingPriceUpdate: ShippingPriceUpdateClient },
  } = ctx

  const requestId: any = reqBody.shippingRate.request_id

  const shippingItemIndex = reqBody.items.findIndex(
    (item: any) => item.name === 'Shipping'
  )

  const shippingObject = reqBody.shippingRate

  const priceAsNumber = Number(shippingObject?.total.value)

  const data = (await ShippingPriceUpdateClient.updateCartWithShipping(
    ctx.vtex.route.params.orderFormId.toString(),
    shippingItemIndex,
    priceAsNumber
  )) as unknown as ShippingPriceUpdateResponse

  return {
    data,
    shippingObject,
    requestId,
  }
}
