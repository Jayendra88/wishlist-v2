import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

const baseUrl = '/pricing/prices'

const routes = {
  fixedPrices: (itemId: string | string[]) => `${baseUrl}/${itemId}/fixed`,
}

export class Pricing extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(`http://api.vtex.com/${context.account}`, context, {
      ...options,
      headers: {
        ...options?.headers,
        Accept: 'application/vnd.vtex.pricing.v3+json',
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
        'X-Vtex-Use-Https': 'true',
        Authorization: context.authToken,
      },
    })
  }

  public getFixedPrices(itemId: string | string[]) {
    // 0 means error product, no price available
    if (itemId === '0') return Promise.resolve([])

    return this.http.get(routes.fixedPrices(itemId))
  }
}
