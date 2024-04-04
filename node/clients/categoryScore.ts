import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

const baseUrl = `/api/catalog/pvt/category/`

const routes = {
  categoryScore: (itemId: number) => `${baseUrl}${itemId}`,
}

export class CategoryScore extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(`https://${context.account}.vtexcommercestable.com.br`, context, {
      ...options,
      headers: {
        ...options?.headers,
        Accept: '*/*',
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
        'X-Vtex-Use-Https': 'true',
        VtexIdclientAutcookie: context.authToken,
      },
    })
  }

  public getCategoryScore(itemId: number) {
    return this.http.get(routes.categoryScore(itemId))
  }
}
