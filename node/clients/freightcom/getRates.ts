import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient, CacheType } from '@vtex/api'

import { FREIGHTCOM_AUTH_KEY } from '../../constants'

export class ShippingRates extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(`https://external-api.freightcom.com`, context, {
      ...options,
      headers: {
        ...options?.headers,
        'Content-Type': 'application/json',
      },
    })
  }

  public getShippingRates(rateId: string) {
    return this.http.get(`/rate/${rateId}`, {
      cacheable: CacheType.None,
      headers: {
        Authorization: FREIGHTCOM_AUTH_KEY,
      },
    })
  }
}
