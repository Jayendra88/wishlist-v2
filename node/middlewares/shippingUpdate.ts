import { json } from 'co-body'

import updatePrice from '../helpers/updatePrice'

export async function shippingUpdate(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { shippingUpdate: ShippingMethodClient },
  } = ctx

  const reqBody = await json(ctx.req)

  const updatePriceResponse = await updatePrice(ctx, reqBody)

  const shippingObject = {
    service_name: updatePriceResponse.shippingObject.service_name,
    carrier_name: updatePriceResponse.shippingObject.carrier_name,
    service_id: updatePriceResponse.shippingObject.service_id,
    total: updatePriceResponse.shippingObject.total,
    transit_time_days: updatePriceResponse.shippingObject.transit_time_days,
    requestId: updatePriceResponse.requestId || 'Internal',
    whitebird_delivery_code:
      updatePriceResponse.shippingObject.whitebird_delivery_code || 'Not found',
  }

  try {
    await ShippingMethodClient.saveEntry({
      id: updatePriceResponse.data.orderFormId,
      orderFormId: updatePriceResponse.data.orderFormId,
      email: updatePriceResponse.data.clientProfileData.email,
      firstName: updatePriceResponse.data.clientProfileData.firstName,
      lastName: updatePriceResponse.data.clientProfileData.lastName,
      addressObject: updatePriceResponse.data.shippingData.selectedAddresses[0],
      shippingObject,
    })

    ctx.body = { message: 'Shipping updated' }
  } catch (error) {
    // Check if the status is 304 and return a success response
    if (error.response && error.response.status === 304) {
      ctx.status = 200
      ctx.body = { message: 'No update needed, data is unchanged.' }
    } else {
      ctx.status = error.response ? error.response.status : 500
      ctx.body = { message: error.message || 'An unknown error occurred.' }
    }
  }

  await next()
}
