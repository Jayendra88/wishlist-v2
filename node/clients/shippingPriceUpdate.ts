import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

const routes = {
  shipping: (orderFormId: string, indexOfShippingItem: string) =>
    `/api/checkout/pub/orderForm/${orderFormId}/items/${indexOfShippingItem}/price`,
}

export class ShippingPriceUpdate extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(
      `http://${context.workspace}--${context.account}.myvtex.com`,
      context,
      {
        ...options,
        headers: {
          ...options?.headers,
          'Cache-Control': 'no-cache',
          'X-Vtex-Use-Https': 'true',
          Accept: '*/*',
          'Content-Type': 'application/json',
          VtexIdclientAutCookie: context.authToken,
        },
      }
    )
  }

  public updateCartWithShipping(
    orderFormId: string,
    indexOfShippingItem: string,
    priceAsNumber: number
  ) {
    return this.http.put(routes.shipping(orderFormId, indexOfShippingItem), {
      price: priceAsNumber,
    })
  }
}
