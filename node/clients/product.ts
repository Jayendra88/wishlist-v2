import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

const routes = {
  product: (itemId: string | string[]) =>
    `/api/catalog_system/pvt/sku/stockkeepingunitbyid/${itemId}`,
  categoryTree: () => `/api/catalog_system/pub/category/tree/1`,
}

export class Product extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(
      `http://${context.workspace}--${context.account}.myvtex.com`,
      context,
      {
        ...options,
        headers: {
          ...options?.headers,
          Accept: 'application/vnd.vtex.pricing.v3+json',
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/json',
          'X-Vtex-Use-Https': 'true',
          VtexIdclientAutcookie: context.authToken,
        },
      }
    )
  }

  public getProductDetails(itemId: string | string[]) {
    return this.http.get(routes.product(itemId))
  }

  public getCategoryTree() {
    return this.http.get(routes.categoryTree())
  }
}
