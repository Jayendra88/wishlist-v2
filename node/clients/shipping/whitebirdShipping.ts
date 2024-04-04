export interface ShippingCode {
  min_charge: string
  min_order_value: number
  service_name: string
  price_breaks?: string
}

export interface PriceBreak {
  minValue: number
  charge: number
}

export const whitebirdShipping = (
  shippinChargeWithSurCharge: number,
  surcharge: number,
  shippingRateSubtotal: number,
  deliveryCode: string
) => {
  return [
    {
      service_id: 'whitebird.ground',
      service_name: 'Ground',
      carrier_name: 'Whitebird',
      total: {
        subtotal: shippingRateSubtotal,
        value: shippinChargeWithSurCharge,
        currency: 'CAD',
        surcharge,
      },
      transit_time_days: '2',
      whitebird_delivery_code: deliveryCode,
    },
  ]
}

export const whitebirdPickUp = (
  shippingCodeRate: ShippingCode,
  pickUpCode: string
) => {
  return [
    {
      service_id: 'whitebird.pickup',
      service_name: 'Pick Up',
      carrier_name: 'Whitebird',
      total: {
        value: shippingCodeRate.min_charge,
        currency: 'CAD',
      },
      transit_time_days:
        'Your order will be ready for pickup on the next business day. If you need your order sooner please call our customer service department.',
      whitebird_delivery_code: pickUpCode,
    },
  ]
}
