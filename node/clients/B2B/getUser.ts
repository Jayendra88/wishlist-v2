import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

const routes = {
  user: (email: string | string[]) =>
    `/api/dataentities/CL/search?email=${email}`,
}

export class GetUser extends ExternalClient {
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

  public getUser(email: string | string[]) {
    return this.http.get(routes.user(email))
  }
}
