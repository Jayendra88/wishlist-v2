import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

const routes = {
  organization: (id: string | string[]) =>
    `/api/dataentities/cost_centers/search?_fields=_all&businessDocument=${id}&_schema=v0.0.7`,
}

export class GetOrganization extends ExternalClient {
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

  public getOrg(id: string | string[]) {
    return this.http.get(routes.organization(id))
  }
}
