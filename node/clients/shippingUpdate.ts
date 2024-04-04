import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

import type { Freightcom, SelectedAddress } from '../typings/freightcom'

const routes = {
  saveShipping: `/api/dataentities/OS/documents`,
}

export class ShippingUpdate extends ExternalClient {
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

  public saveEntry(requestBody: {
    id: string
    orderFormId: string
    email: string
    firstName: string
    lastName: string
    addressObject: SelectedAddress
    shippingObject: Freightcom | undefined
  }) {
    return this.http.put(routes.saveShipping, JSON.stringify(requestBody))
  }
}
