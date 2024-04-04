// shipping codes legend
// PICK = free pick up
// PICH = pick up with charge
// WH1 = whitebird delivery with 1.9% surcharge
// WH2 = whitebird delivery with 0 surcharge
// FRTC = freightcom delivery

import { json } from 'co-body'

import type {
  ShippingCode,
  PriceBreak,
} from '../clients/shipping/whitebirdShipping'
import {
  whitebirdShipping,
  whitebirdPickUp,
} from '../clients/shipping/whitebirdShipping'
import {
  FREE_PICK_UP_VALUE,
  pickUp,
  freePickUp,
  DEFAULT_SURCHARGE_CODE,
  DEFAULT_SURCHARGE,
  WHITEBIRD_PRICE_BUFFER,
  FREE_DELIVERY_VALUE,
} from '../constants'
import getTypeCode from '../helpers/getTypeCode'
import getProductDetails from '../helpers/getProductDetails'
import isPostalCodeInRange from '../helpers/isPostalCodeInRange'
import getOrgCustomFieldCodes from '../helpers/getOrgCustomFieldCodes'
import getCostCenterCustomFieldCodes from '../helpers/getCostCenterCustomFieldCodes'

// Constants
const SHIPPING_ITEM_ID = '7402'

export async function shipping(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { shipping: ShippingClient, shippingRates: ShippingRatesClient },
  } = ctx

  const reqBody: any = await json(ctx.req)

  const { pickUpCode, typeCode, deliveryCode } = await getOrgCustomFieldCodes(
    reqBody,
    ctx
  )

  const { isResidential, tailgateNeeded } = await getCostCenterCustomFieldCodes(
    reqBody,
    ctx
  )

  const inPostalCodeRange: boolean = await isPostalCodeInRange(
    reqBody.postalCode,
    ctx
  )

  const pickUpOption =
    pickUpCode === 'PICK' ||
    (pickUpCode === 'PICH' && reqBody.total > FREE_PICK_UP_VALUE)
      ? freePickUp
      : pickUp

  if (!isResidential && inPostalCodeRange) {
    const localTypeCode = typeCode || DEFAULT_SURCHARGE_CODE
    let orderSubtotal = reqBody.total
    let shippingRateCharge = 0

    const shippingCodePrice = (await getTypeCode(
      localTypeCode,
      ctx
    )) as ShippingCode[]

    const [shippingCodeRate] = shippingCodePrice

    if (shippingCodeRate.price_breaks?.length) {
      const priceBreaks = JSON.parse(
        shippingCodeRate.price_breaks
      ) as PriceBreak[]

      // Find the correct charge based on orderSubtotal
      for (const priceBreak of priceBreaks) {
        if (orderSubtotal <= priceBreak.minValue) {
          shippingRateCharge = priceBreak.charge
          break // Exit the loop once the correct charge is found
        }
      }
    } else {
      shippingRateCharge = parseInt(shippingCodeRate.min_charge, 10)
    }

    const shippingItem = reqBody.items.find(
      (item: any) => item.id === SHIPPING_ITEM_ID
    )

    let shippingSurcharge = 0
    let shippinChargeWithSurCharge = 0

    if (shippingItem) {
      orderSubtotal = reqBody.total - shippingItem.price
    }

    if (deliveryCode !== 'WH2') {
      if (orderSubtotal >= FREE_DELIVERY_VALUE) {
        shippingRateCharge = 0
      }

      shippingSurcharge = orderSubtotal * DEFAULT_SURCHARGE
      shippinChargeWithSurCharge = shippingRateCharge + shippingSurcharge
    }

    ctx.body = {
      rates: whitebirdShipping(
        Math.round(shippinChargeWithSurCharge),
        Math.round(shippingSurcharge),
        shippingRateCharge,
        deliveryCode === 'WH2' ? 'WH2' : 'WH1'
      ),
      pick_up_rates: whitebirdPickUp(pickUpOption, 'PICK'),
    }
    await next()

    return
  }

  const productDetails = await getProductDetails(ctx, reqBody)

  const ratesPromises: any = [
    ShippingClient.createLTLQuote(
      reqBody,
      productDetails.productDimensionsLTL,
      isResidential,
      tailgateNeeded
    ),
    ShippingClient.createPackageQuote(
      reqBody,
      productDetails.productDimensionsPackage,
      isResidential,
      tailgateNeeded
    ),
  ]

  const shippingRatesRequestData: any = await Promise.all(ratesPromises)

  const [ratesLTLRequest, ratesPackageRequest] = shippingRatesRequestData

  let isRatesFull = false

  const getShipping = async () => {
    let ltlShippingData: any = []
    let shippingPackageData: any = []

    const startTime = Date.now() // to record when we started

    // Check for time difference
    while (!isRatesFull && Date.now() - startTime < 15000) {
      const promises: any = [
        ShippingRatesClient.getShippingRates(ratesLTLRequest.request_id),
        ShippingRatesClient.getShippingRates(ratesPackageRequest.request_id),
      ]

      // eslint-disable-next-line no-await-in-loop
      const shippingRateData: any = await Promise.all(promises)
      const [ltlRates, packageRates] = shippingRateData

      isRatesFull = ltlRates.status.done && packageRates.status.done
      ltlShippingData = ltlRates
      shippingPackageData = packageRates

      if (!isRatesFull) {
        // Sleep for a short duration before checking again.
        // This is to avoid spamming the API too frequently within the 10 second window.
        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Sleep for 1 seconds
      }
    }

    const ltlRatesWithRequestId: any = ltlShippingData.rates.map(
      (rate: any) => {
        return {
          ...rate,
          request_id: ratesLTLRequest.request_id,
        }
      }
    )

    const packageRatesWithRequestId: any = shippingPackageData.rates.map(
      (rate: any) => {
        return {
          ...rate,
          request_id: ratesPackageRequest.request_id,
        }
      }
    )

    const topRates = [...ltlRatesWithRequestId, ...packageRatesWithRequestId]
      .sort(
        (previousRate, currentRate) =>
          previousRate.total.value - currentRate.total.value
      )
      .slice(0, 6)

    const adjustedTopRates = topRates.map((rate) => {
      const adjustedRate = {
        ...rate,
        total: {
          ...rate.total,
          value: Math.round(rate.total.value * WHITEBIRD_PRICE_BUFFER),
        },
        whitebird_delivery_code: 'FRTC',
      }

      return adjustedRate
    })

    return {
      LTL_request_id: ratesLTLRequest.request_id,
      package_request_id: ratesPackageRequest.request_id,
      rates: adjustedTopRates,
      pick_up_rates: whitebirdPickUp(pickUpOption, 'PICK'),
    }
  }

  const ratesData: any = await getShipping()

  ctx.body = ratesData
  await next()
}
