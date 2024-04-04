import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

import {
  reqOptions,
  listBodyXml,
  reqOptionsXml,
} from './orderHistory/getOrderHistory'
import { detailsBody } from './orderHistory/getOrderDetails'
import { prontoOrderUrl } from '../../utils/constants'

export class OrderHistory extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(`${prontoOrderUrl}`, context, {
      ...options,
      headers: {
        'X-VTEX-Use-Https': 'true',
      },
    })
  }

  public getOrderHistory(
    token: string,
    orderId?: number,
    businessDocument?: string
  ) {
    return this.http.post(
      '/api/SalesOrderGetSalesOrders',
      listBodyXml(orderId, businessDocument),
      reqOptionsXml(token)
    )
  }

  public getOrder(token: string, id: string, businessDocument: string) {
    return this.http.post(
      '/api/SalesOrderGetSalesOrders',
      detailsBody(id, businessDocument),
      reqOptions(token)
    )
  }
}
