import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

import { prontoOrderUrl } from '../../utils/constants'

export class ProntoLogin extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(`${prontoOrderUrl}`, context, {
      ...options,
      headers: {
        'Cache-Control': 'no-cache no-store, must-revalidate',
        'X-VTEX-Use-Https': 'true',
        'X-Pronto-Content-Type': 'application/json',
        // Need to get a better way of hiding this
        'X-Pronto-Password': 'Trumpet#760',
        'X-Pronto-Username': 'syattapi',
      },
    })
  }

  // Hitting the login end point for a new api token
  public login() {
    return this.http.post('/login')
  }
}
