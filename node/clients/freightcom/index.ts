import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient, CacheType } from '@vtex/api'

import { FREIGHTCOM_AUTH_KEY, WAREHOUSE_ADDRESS } from '../../constants'
import shippingDate from '../../helpers/shippingDate'

type Address = {
  address: string
  city: string
  state: string
  postalCode: string
  country: string
  receiverName: string
  costCenter: string
}

const { currentYear, currentDay, currentMonth } = shippingDate()

export class Shipping extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(`https://external-api.freightcom.com`, context, {
      ...options,
      headers: {
        ...options?.headers,
        'Content-Type': 'application/json',
      },
    })
  }

  public createLTLQuote(
    shippingDetails: Address,
    productDetails: any,
    isResidential: boolean,
    tailgateNeeded: boolean
  ) {
    return this.http.post(
      '/rate',
      {
        details: {
          origin: WAREHOUSE_ADDRESS,
          destination: this.destinationParams(
            shippingDetails,
            isResidential,
            tailgateNeeded
          ),
          expected_ship_date: {
            year: currentYear,
            month: currentMonth,
            day: currentDay,
          },
          packaging_type: 'pallet',
          packaging_properties: {
            pallet_type: 'ltl',
            has_stackable_pallets: false,
            pallets: productDetails,
          },
        },
      },
      {
        cacheable: CacheType.None,
        headers: {
          Authorization: FREIGHTCOM_AUTH_KEY,
        },
      }
    )
  }

  public createPackageQuote(
    shippingDetails: Address,
    productDetails: any,
    isResidential: boolean,
    tailgateNeeded: boolean
  ) {
    return this.http.post(
      '/rate',
      {
        details: {
          origin: WAREHOUSE_ADDRESS,
          destination: this.destinationParams(
            shippingDetails,
            isResidential,
            tailgateNeeded
          ),
          expected_ship_date: {
            year: currentYear,
            month: currentMonth,
            day: currentDay,
          },
          packaging_type: 'package',
          packaging_properties: {
            has_dangerous_goods: false,
            includes_return_label: false,
            packages: productDetails,
          },
        },
      },
      {
        cacheable: CacheType.None,
        headers: {
          Authorization: FREIGHTCOM_AUTH_KEY,
        },
      }
    )
  }

  private destinationParams(
    shippingDetails: Address,
    isResidential: boolean,
    tailgateNeeded: boolean
  ) {
    return {
      name: shippingDetails.costCenter,
      address: {
        address_line_1: shippingDetails.address,
        address_line_2: '',
        unit_number: '',
        city: shippingDetails.city,
        region: shippingDetails.state,
        country: shippingDetails.country,
        postal_code: shippingDetails.postalCode,
      },
      residential: isResidential,
      tailgate_required: tailgateNeeded,
      contact_name: shippingDetails.receiverName,
    }
  }
}
