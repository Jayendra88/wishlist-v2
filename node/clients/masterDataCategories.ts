import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

const DATA_ENTITY_PREFIX = 'whitebird_'

const SCHEMA_VERSION = 'v5'

const deleteRoute = (dataEntity: string, categoryId: string) => {
  const url = `/api/dataentities/${DATA_ENTITY_PREFIX}${dataEntity}/documents/${categoryId}?_schema=${SCHEMA_VERSION}`

  return url
}

const routes = {
  deleteCategoryGrid: (categoryId: string) =>
    deleteRoute('categories', categoryId),
}

export class MasterDataCategories extends ExternalClient {
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
          VtexIdclientAutcookie: context.adminUserAuthToken ?? '',
        },
      }
    )
  }

  public async deleteCategoryGrid(categoryId: string) {
    return this.http.delete(routes.deleteCategoryGrid(categoryId), {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
