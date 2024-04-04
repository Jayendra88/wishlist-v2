import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

const routes = {
  addUser: () => `/api/dataentities/b2b_users/documents`,
}

export class AddUser extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(
      `http://${context.workspace}--${context.account}.myvtex.com`,
      context,
      {
        ...options,
        headers: {
          ...options?.headers,
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/json',
          'X-Vtex-Use-Https': 'true',
          VtexIdclientAutcookie: context.authToken,
        },
      }
    )
  }

  public addUser(reqBody: Record<string, any>) {
    return this.http.post(routes.addUser(), reqBody)
  }
}
