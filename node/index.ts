import type {
  ParamsContext,
  ClientsConfig,
  ServiceContext,
  RecorderState,
} from '@vtex/api'
import { LRUCache, Service } from '@vtex/api'

import { Clients } from './clients'
import { resolvers } from './resolvers'
import { fixedPrices } from './resolvers/fixedPrices'
import { productsByRefId } from './resolvers/productsByRefId'
import { subcategoryWithScore } from './resolvers/subcategoryWithScore'

const TIMEOUT_MS = 5000

const memoryCache = new LRUCache<string, any>({ max: 5000 })

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      retries: 5,
      timeout: TIMEOUT_MS,
    },
    status: {
      memoryCache,
    },
  },
}

declare global {
  type Context = ServiceContext<Clients>
}

// Export a service that defines route handlers and client options.
export default new Service<Clients, RecorderState, ParamsContext>({
  clients,
  routes: { ...resolvers.Routes },
  graphql: {
    resolvers: {
      Query: {
        fixedPrices,
        productsByRefId,
        subcategoryWithScore,
      },
    },
  },
})
